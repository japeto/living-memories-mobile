import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';
import { container } from '../../../di/container';
import { GetTodayMemoriesUseCase } from '../../../domain/memories/useCases/GetTodayMemoriesUseCase';
import { ProcessNewMemoryUseCase } from '../../../domain/memories/useCases/ProcessNewMemoryUseCase';

jest.mock('../../../domain/memories/useCases/GetTodayMemoriesUseCase');
jest.mock('../../../domain/memories/useCases/ProcessNewMemoryUseCase');

describe('useHomeViewModel', () => {
  const mockGetTodayMemories = jest.fn();
  const mockProcessNewMemory = jest.fn();

  beforeAll(() => {
    container.resolve = jest.fn((token: any) => {
      if (token === GetTodayMemoriesUseCase) {
        return { execute: mockGetTodayMemories };
      }
      if (token === ProcessNewMemoryUseCase) {
        return { execute: mockProcessNewMemory };
      }
      return {};
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load initial memories on mount', async () => {
    const mockMemories = [{ id: 1, text: 'Test memory', time: '10:00', day: 'Hoy', topic: 'Familia', mood: 'Feliz' }];
    // return a promise that resolves immediately to avoid it being completely sync
    mockGetTodayMemories.mockImplementation(() => Promise.resolve(mockMemories));

    const { result } = renderHook(() => useHomeViewModel());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.memories).toEqual(mockMemories);
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(1);
  });

  it('should start recording, stop, and process new memory', async () => {
    jest.useFakeTimers();
    mockGetTodayMemories.mockImplementation(() => Promise.resolve([]));
    const newMemory = { id: 2, text: 'New memory', time: '11:00', day: 'Hoy', topic: 'Trabajo', mood: 'Neutral' };
    mockProcessNewMemory.mockImplementation(() => Promise.resolve(newMemory));

    const { result } = renderHook(() => useHomeViewModel());
    
    // Wait for initial fetch
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.onToggleRecord();
    });

    expect(result.current.phase).toBe('rec');
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(result.current.seconds).toBe(2);

    // Stop recording
    act(() => {
      result.current.onToggleRecord();
    });

    expect(result.current.phase).toBe('proc');
    expect(result.current.layerStep).toBe(0);

    // We need to wait for microtasks (the .then() to schedule setTimeout)
    // Then advance the timers
    await act(async () => {
      await Promise.resolve(); // flush microtasks
    });

    for (let i = 1; i <= 3; i++) {
      act(() => {
        jest.advanceTimersByTime(800);
      });
      expect(result.current.layerStep).toBe(i);
    }
    
    // Advance the remaining time to trigger the final setTimeout that resets everything
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(result.current.phase).toBe('idle');
    expect(result.current.memories).toEqual([newMemory]);
    
    jest.useRealTimers();
  });
});
