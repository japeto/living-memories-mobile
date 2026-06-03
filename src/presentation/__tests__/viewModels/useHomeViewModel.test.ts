import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';
import { container } from '../../../di/container';
import { GetTodayMemoriesUseCase } from '../../../domain/memories/useCases/GetTodayMemoriesUseCase';

jest.mock('../../../domain/memories/useCases/GetTodayMemoriesUseCase');

const mockStartRecording = jest.fn();
const mockStopRecording = jest.fn();
let onMemoryRecordedCb: any;

jest.mock('../../viewModels/home/useRecordingViewModel', () => ({
  useRecordingViewModel: jest.fn((cb) => {
    onMemoryRecordedCb = cb;
    return {
      isRecording: false,
      isProcessing: false,
      recordingSeconds: 2, // Mocked for test
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      permissionGranted: true,
      error: null
    };
  }),
}));

describe('useHomeViewModel', () => {
  const mockGetTodayMemories = jest.fn();

  beforeAll(() => {
    container.resolve = jest.fn((token: any) => {
      if (token === GetTodayMemoriesUseCase) {
        return { execute: mockGetTodayMemories };
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

    const { result } = renderHook(() => useHomeViewModel());
    
    // Wait for initial fetch
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve(); // flush microtasks
    });

    expect(result.current.phase).toBe('rec');
    expect(mockStartRecording).toHaveBeenCalled();
    
    // Stop recording
    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve(); // flush microtasks
    });

    expect(result.current.phase).toBe('proc');
    expect(result.current.layerStep).toBe(0);
    expect(mockStopRecording).toHaveBeenCalled();

    // Trigger onMemoryRecorded
    act(() => {
      if (onMemoryRecordedCb) {
        onMemoryRecordedCb();
      }
    });

    expect(result.current.layerStep).toBe(4);

    // Fast forward the setTimeout inside onMemoryRecordedCb
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.layerStep).toBe(0);
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(2); // once on mount, once on recorded
    
    jest.useRealTimers();
  });
});
