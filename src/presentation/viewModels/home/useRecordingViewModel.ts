import { useState, useEffect, useRef } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { container } from '../../../di/container';
import { RecordMemoryUseCase } from '../../../domain/memories/useCases/RecordMemoryUseCase';

export interface RecordingViewModelState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingSeconds: number;
  liveText: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
}

const MAX_RECORDING_SECONDS = 180; // 3 minutes

export function useRecordingViewModel(onMemoryRecorded?: () => void): RecordingViewModelState {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveText, setLiveText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalLiveTextRef = useRef<string>('');
  
  const recordMemoryUseCase = container.resolve(RecordMemoryUseCase);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsRecording(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      setIsRecording(false);
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Speech recognition error:', e.error);
      if (e.error?.message?.includes('No speech')) {
        // Ignore "No speech" timeouts if we are just quiet
      } else {
        setError(e.error?.message || 'Speech recognition error.');
      }
      setIsRecording(false);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setLiveText(e.value[0]);
        finalLiveTextRef.current = e.value[0];
      }
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setLiveText(e.value[0]);
        finalLiveTextRef.current = e.value[0];
      }
    };

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Monitor 3 minutes limit
  useEffect(() => {
    if (isRecording && recordingSeconds >= MAX_RECORDING_SECONDS) {
      stopRecording();
    }
  }, [isRecording, recordingSeconds]);

  const startRecording = async () => {
    try {
      setError(null);
      setLiveText('');
      finalLiveTextRef.current = '';
      setRecordingSeconds(0);
      
      await Voice.start('es-ES');
      
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      
    } catch (err: any) {
      console.error('Failed to start recording', err);
      setError('An error occurred while starting the recording.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!isRecording) return;
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      setIsRecording(false);
      setIsProcessing(true);

      await Voice.stop();

      const transcribedText = finalLiveTextRef.current.trim();
      
      if (!transcribedText) {
        // If nothing was recorded, we don't save the memory and exit
        setError('No se detectó voz.');
        return;
      }

      await recordMemoryUseCase.execute(transcribedText);

      if (onMemoryRecorded) {
        onMemoryRecorded();
      }

    } catch (err) {
      console.error('Failed to stop/process recording', err);
      setError('An error occurred while processing the recording.');
    } finally {
      setIsProcessing(false);
      setRecordingSeconds(0);
    }
  };

  return {
    isRecording,
    isProcessing,
    recordingSeconds,
    liveText,
    startRecording,
    stopRecording,
    error
  };
}
