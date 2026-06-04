import { renderHook, act } from '@testing-library/react-hooks';
import { useMemoriesViewModel } from '../../viewModels/memories/useMemoriesViewModel';
import { container } from '../../../di/container';
import { GetAllMemoriesUseCase } from '../../../domain/memories/useCases/GetAllMemoriesUseCase';

jest.mock('../../../di/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

// Mock useFocusEffect to simply call the callback immediately
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

describe('useMemoriesViewModel', () => {
  let mockGetAllMemoriesUseCase: jest.Mocked<GetAllMemoriesUseCase>;

  beforeEach(() => {
    mockGetAllMemoriesUseCase = {
      execute: jest.fn(),
    } as any;
    
    (container.resolve as jest.Mock).mockReturnValue(mockGetAllMemoriesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializarse con estado de carga y llamar al caso de uso', async () => {
    mockGetAllMemoriesUseCase.execute.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useMemoriesViewModel());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.sections).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockGetAllMemoriesUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('debería manejar errores si el caso de uso falla', async () => {
    mockGetAllMemoriesUseCase.execute.mockRejectedValue(new Error('Falla en DB'));

    const { result, waitForNextUpdate } = renderHook(() => useMemoriesViewModel());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Falla en DB');
    expect(result.current.sections).toEqual([]);
  });

  it('debería agrupar las memorias por día', async () => {
    const mockMemories = [
      { id: '1', title: 'A', day: 'Hoy', topic: 'Familia' },
      { id: '2', title: 'B', day: 'Ayer', topic: 'Amigos' },
      { id: '3', title: 'C', day: 'Hoy', topic: 'Salud' },
    ];
    mockGetAllMemoriesUseCase.execute.mockResolvedValue(mockMemories as any);

    const { result, waitForNextUpdate } = renderHook(() => useMemoriesViewModel());

    await waitForNextUpdate();

    expect(result.current.sections).toEqual([
      { title: 'Hoy', data: [mockMemories[0], mockMemories[2]] },
      { title: 'Ayer', data: [mockMemories[1]] },
    ]);
  });

  it('debería extraer los tópicos únicos de las memorias', async () => {
    const mockMemories = [
      { id: '1', title: 'A', topic: 'Familia' },
      { id: '2', title: 'B', topic: 'Amigos' },
      { id: '3', title: 'C', topic: 'Familia' },
      { id: '4', title: 'D' }, // sin tópico
    ];
    mockGetAllMemoriesUseCase.execute.mockResolvedValue(mockMemories as any);

    const { result, waitForNextUpdate } = renderHook(() => useMemoriesViewModel());

    await waitForNextUpdate();

    expect(result.current.availableTopics).toEqual(['Familia', 'Amigos']);
  });

  it('debería permitir filtrar por un tópico', async () => {
    const mockMemories = [
      { id: '1', title: 'A', day: 'Hoy', topic: 'Familia' },
      { id: '2', title: 'B', day: 'Hoy', topic: 'Amigos' },
    ];
    mockGetAllMemoriesUseCase.execute.mockResolvedValue(mockMemories as any);

    const { result, waitForNextUpdate } = renderHook(() => useMemoriesViewModel());

    await waitForNextUpdate();

    act(() => {
      result.current.toggleTopicFilter('Familia');
    });

    expect(result.current.selectedTopic).toBe('Familia');
    expect(result.current.sections).toEqual([
      { title: 'Hoy', data: [mockMemories[0]] }
    ]);
  });
});
