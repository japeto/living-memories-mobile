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

  it('should stop recording, process audio and clear state', async () => {
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

    await act(async () => {
      await result.current.stopRecording();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(mockRecordMemoryUseCase.execute).toHaveBeenCalledWith('Transcripción final grabada');
    expect(mockOnMemoryRecorded).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.recordingSeconds).toBe(0);
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

  it('should set an error if speech stops with no transcribed text', async () => {
    const { result } = renderHook(() => useRecordingViewModel());

    act(() => {
      if (Voice.onSpeechStart) Voice.onSpeechStart({} as any);
      // No text received
    });

    await act(async () => {
      await result.current.stopRecording();
    });

    expect(Voice.stop).toHaveBeenCalled();
    expect(mockRecordMemoryUseCase.execute).not.toHaveBeenCalled();
    expect(result.current.error).toBe('No se detectó voz.');
  });
});
