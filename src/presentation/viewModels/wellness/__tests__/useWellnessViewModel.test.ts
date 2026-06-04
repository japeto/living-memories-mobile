import { renderHook, act } from '@testing-library/react-native';
import { useWellnessViewModel } from '../useWellnessViewModel';
import { container } from '../../../../di/container';
import { GetWeeklyWellnessUseCase } from '../../../../domain/wellness/useCases/GetWeeklyWellnessUseCase';

jest.mock('../../../../di/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

describe('useWellnessViewModel', () => {
  const mockWellnessData = {
    week: 'Del 12 al 18 de Octubre',
    moods: [
      { day: 'L', level: 0.8, label: 'Alegría' },
      { day: 'M', level: 0.6, label: 'Tranquilo' },
      { day: 'M', level: 0.5, label: 'Cansancio' },
      { day: 'J', level: 0.7, label: 'Tranquilo' },
      { day: 'V', level: 0.9, label: 'Alegría' },
      { day: 'S', level: 0.4, label: 'Nostalgia' },
      { day: 'D', level: 0.8, label: 'Alegría' },
    ],
    topics: [
      { name: 'Familia', percentage: 45 },
      { name: 'Salud', percentage: 25 },
      { name: 'Lecturas', percentage: 15 },
      { name: 'Cotidiano', percentage: 15 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch wellness data successfully', async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockWellnessData),
    };
    (container.resolve as jest.Mock).mockReturnValue(mockUseCase);

    const { result } = renderHook(() => useWellnessViewModel());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      // wait for effect to finish
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockWellnessData);
  });

  it('should handle errors when fetching wellness data', async () => {
    const mockUseCase = {
      execute: jest.fn().mockRejectedValue(new Error('Network error')),
    };
    (container.resolve as jest.Mock).mockReturnValue(mockUseCase);

    const { result } = renderHook(() => useWellnessViewModel());

    await act(async () => {
      // wait for effect to finish
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
  });
});
