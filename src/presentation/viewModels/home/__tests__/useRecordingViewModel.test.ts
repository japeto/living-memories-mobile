import { renderHook, act } from '@testing-library/react-hooks';
import { useRecordingViewModel } from '../useRecordingViewModel';
import Voice from '@react-native-voice/voice';
import { container } from '../../../../di/container';
import { RecordMemoryUseCase } from '../../../../domain/memories/useCases/RecordMemoryUseCase';

jest.mock('../../../../di/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

const NO_SPEECH_MESSAGE = 'No se detectó voz. Intenta de nuevo.';
const API_ERROR_MESSAGE = 'No pudimos guardar tu recuerdo. Intenta de nuevo en un momento.';

describe('useRecordingViewModel', () => {
  let mockRecordMemoryUseCase: jest.Mocked<RecordMemoryUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRecordMemoryUseCase = {
      execute: jest.fn().mockResolvedValue({}),
    } as any;

    (container.resolve as jest.Mock).mockReturnValue(mockRecordMemoryUseCase);
  });

  afterEach(() => {
    // Make sure we clean up timers if any are left
    jest.useRealTimers();
  });

  it('should initialize correctly and setup voice listeners', () => {
    const { result } = renderHook(() => useRecordingViewModel());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.liveText).toBe('');

    // Voice listeners should be attached
    expect(Voice.onSpeechStart).toBeDefined();
    expect(Voice.onSpeechEnd).toBeDefined();
    expect(Voice.onSpeechError).toBeDefined();
    expect(Voice.onSpeechResults).toBeDefined();
    expect(Voice.onSpeechPartialResults).toBeDefined();
  });

  it('should handle onSpeechStart correctly', async () => {
    const { result } = renderHook(() => useRecordingViewModel());

    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
    });

    expect(result.current.isRecording).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should update liveText when speech results are received', async () => {
    const { result } = renderHook(() => useRecordingViewModel());

    act(() => {
      if (Voice.onSpeechResults) {
        Voice.onSpeechResults({ value: ['Hola mundo'] } as any);
      }
    });

    expect(result.current.liveText).toBe('Hola mundo');
  });

  it('should start recording successfully', async () => {
    const { result } = renderHook(() => useRecordingViewModel());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(Voice.start).toHaveBeenCalledWith('es-ES');
    expect(result.current.recordingSeconds).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should increment recordingSeconds correctly', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRecordingViewModel());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.recordingSeconds).toBe(2);
    jest.useRealTimers();
  });

  it('should stop recording, process audio and return ok=true on happy path', async () => {
    const mockOnMemoryRecorded = jest.fn();
    const { result } = renderHook(() => useRecordingViewModel(mockOnMemoryRecorded));

    // Simulate starting recording and receiving text
    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      if (Voice.onSpeechResults) {
        Voice.onSpeechResults({ value: ['Transcripción final grabada'] } as any);
      }
    });

    expect(result.current.isRecording).toBe(true);

    let stopResult: any;
    await act(async () => {
      stopResult = await result.current.stopRecording();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(mockRecordMemoryUseCase.execute).toHaveBeenCalledWith('Transcripción final grabada');
    expect(mockOnMemoryRecorded).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.recordingSeconds).toBe(0);
    expect(result.current.error).toBeNull();
    expect(stopResult).toEqual({ ok: true });
  });

  it('should auto-stop recording after 3 minutes (180 seconds)', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRecordingViewModel());

    // Simulate start
    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    // Advance by 180 seconds
    await act(async () => {
      jest.advanceTimersByTime(180000);
      await Promise.resolve();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
    jest.useRealTimers();
  });

  it('should return ok=false with reason=no_speech when no transcribed text is captured', async () => {
    const mockOnMemoryRecorded = jest.fn();
    const { result } = renderHook(() => useRecordingViewModel(mockOnMemoryRecorded));

    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      // No text received — user stayed silent
    });

    let stopResult: any;
    await act(async () => {
      stopResult = await result.current.stopRecording();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(mockRecordMemoryUseCase.execute).not.toHaveBeenCalled();
    // Regression: missing assertion that allowed the original bug to ship.
    expect(mockOnMemoryRecorded).not.toHaveBeenCalled();
    expect(result.current.error).toBe(NO_SPEECH_MESSAGE);
    expect(result.current.isProcessing).toBe(false);
    expect(stopResult).toEqual({
      ok: false,
      reason: 'no_speech',
      message: NO_SPEECH_MESSAGE,
    });
  });

  it('should return ok=false with reason=api_error when recordMemoryUseCase throws', async () => {
    mockRecordMemoryUseCase.execute = jest.fn().mockRejectedValue(new Error('Network down'));
    (container.resolve as jest.Mock).mockReturnValue(mockRecordMemoryUseCase);

    const mockOnMemoryRecorded = jest.fn();
    const { result } = renderHook(() => useRecordingViewModel(mockOnMemoryRecorded));

    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      if (Voice.onSpeechResults) {
        Voice.onSpeechResults({ value: ['Texto válido'] } as any);
      }
    });

    let stopResult: any;
    await act(async () => {
      stopResult = await result.current.stopRecording();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(mockRecordMemoryUseCase.execute).toHaveBeenCalledWith('Texto válido');
    expect(mockOnMemoryRecorded).not.toHaveBeenCalled();
    expect(result.current.error).toBe(API_ERROR_MESSAGE);
    expect(result.current.isProcessing).toBe(false);
    expect(stopResult).toEqual({
      ok: false,
      reason: 'api_error',
      message: API_ERROR_MESSAGE,
    });
  });

  it('should still process captured text when Voice.onSpeechEnd fired before stop (STT auto-end race)', async () => {
    const mockOnMemoryRecorded = jest.fn();
    const { result } = renderHook(() => useRecordingViewModel(mockOnMemoryRecorded));

    // Simulate: user spoke, Android captured text, then STT auto-ended on silence
    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      if (Voice.onSpeechResults) {
        Voice.onSpeechResults({ value: ['Texto capturado'] } as any);
      }
      if (Voice.onSpeechEnd) Voice.onSpeechEnd({} as any);
    });

    // isRecording is now false even though the user has not tapped stop yet
    expect(result.current.isRecording).toBe(false);

    let stopResult: any;
    await act(async () => {
      stopResult = await result.current.stopRecording();
    });

    // Regression for BUG 1: the previous `if (!isRecording) return;` guard
    // discarded the transcription. The fix must process it regardless.
    expect(mockRecordMemoryUseCase.execute).toHaveBeenCalledWith('Texto capturado');
    expect(mockOnMemoryRecorded).toHaveBeenCalled();
    expect(stopResult).toEqual({ ok: true });
  });

  it('should be idempotent on concurrent stopRecording calls', async () => {
    const mockOnMemoryRecorded = jest.fn();
    const { result } = renderHook(() => useRecordingViewModel(mockOnMemoryRecorded));

    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      if (Voice.onSpeechResults) {
        Voice.onSpeechResults({ value: ['Texto único'] } as any);
      }
    });

    let firstResult: any;
    let secondResult: any;
    await act(async () => {
      const first = result.current.stopRecording();
      const second = result.current.stopRecording();
      [firstResult, secondResult] = await Promise.all([first, second]);
    });

    expect(Voice.stop).toHaveBeenCalledTimes(1);
    expect(mockRecordMemoryUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockOnMemoryRecorded).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual({ ok: true });
    expect(secondResult).toEqual({ ok: true });
    // Both calls resolve to the same in-flight result
    expect(firstResult).toBe(secondResult);
  });
});
