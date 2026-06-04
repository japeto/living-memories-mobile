import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';
import { container } from '../../../di/container';
import { GetTodayMemoriesUseCase } from '../../../domain/memories/useCases/GetTodayMemoriesUseCase';

jest.mock('../../../domain/memories/useCases/GetTodayMemoriesUseCase');

const NO_SPEECH_MESSAGE = 'No se detectó voz. Intenta de nuevo.';
const UNKNOWN_ERROR_MESSAGE = 'Ocurrió un error procesando la grabación.';

const mockStartRecording = jest.fn();
const mockStopRecording = jest.fn();
let onMemoryRecordedCb: any;

jest.mock('../../viewModels/home/useRecordingViewModel', () => ({
  useRecordingViewModel: jest.fn((cb) => {
    onMemoryRecordedCb = cb;
    return {
      isRecording: false,
      isProcessing: false,
      recordingSeconds: 2,
      liveText: '',
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      error: null,
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
    // Default: stopRecording resolves to ok=true so happy-path tests keep
    // working. Individual tests override this for failure scenarios.
    mockStopRecording.mockResolvedValue({ ok: true });
  });

  it('should load initial memories on mount', async () => {
    const mockMemories = [
      { id: 'mem-1', text: 'Test memory', time: '10:00', day: 'Hoy', topic: 'Familia', mood: 'Feliz' },
    ];
    mockGetTodayMemories.mockImplementation(() => Promise.resolve(mockMemories));

    const { result } = renderHook(() => useHomeViewModel());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.memories).toEqual(mockMemories);
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(1);
  });

  it('should start recording, stop, and process new memory on happy path', async () => {
    jest.useFakeTimers();
    mockGetTodayMemories.mockImplementation(() => Promise.resolve([]));

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('rec');
    expect(mockStartRecording).toHaveBeenCalled();

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('proc');
    expect(result.current.layerStep).toBe(0);
    expect(mockStopRecording).toHaveBeenCalled();

    // Trigger onMemoryRecorded as the recording viewModel would on success
    act(() => {
      if (onMemoryRecordedCb) {
        onMemoryRecordedCb();
      }
    });

    expect(result.current.layerStep).toBe(4);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.layerStep).toBe(0);
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(2); // once on mount, once on recorded
    expect(result.current.errorMessage).toBeNull();

    jest.useRealTimers();
  });

  it('should reset phase to idle and surface errorMessage when stopRecording returns no_speech', async () => {
    mockGetTodayMemories.mockImplementation(() => Promise.resolve([]));
    mockStopRecording.mockResolvedValue({
      ok: false,
      reason: 'no_speech',
      message: NO_SPEECH_MESSAGE,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await Promise.resolve();
    });

    // initial mount fetch
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      // Flush microtasks so the resolved stopRecording promise propagates.
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.layerStep).toBe(0);
    expect(result.current.errorMessage).toBe(NO_SPEECH_MESSAGE);
    // Should NOT refetch memories on a failed recording
    expect(mockGetTodayMemories).toHaveBeenCalledTimes(1);
  });

  it('should reset phase to idle and set unknown errorMessage when stopRecording throws (safety net)', async () => {
    mockGetTodayMemories.mockImplementation(() => Promise.resolve([]));
    mockStopRecording.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.errorMessage).toBe(UNKNOWN_ERROR_MESSAGE);
  });

  it('should clear errorMessage when dismissError is called', async () => {
    mockGetTodayMemories.mockImplementation(() => Promise.resolve([]));
    mockStopRecording.mockResolvedValue({
      ok: false,
      reason: 'no_speech',
      message: NO_SPEECH_MESSAGE,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
    });

    await act(async () => {
      result.current.onToggleRecord();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.errorMessage).toBe(NO_SPEECH_MESSAGE);

    act(() => {
      result.current.dismissError();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});
