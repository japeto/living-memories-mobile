import { useState, useEffect, useRef } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { container } from '../../../di/container';
import { RecordMemoryUseCase } from '../../../domain/memories/useCases/RecordMemoryUseCase';

export type StopRecordingReason = 'no_speech' | 'api_error' | 'unknown';

export type StopRecordingResult =
  | { ok: true }
  | { ok: false; reason: StopRecordingReason; message: string };

export interface RecordingViewModelState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingSeconds: number;
  liveText: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<StopRecordingResult>;
  error: string | null;
}

const MAX_RECORDING_SECONDS = 180; // 3 minutes

const NO_SPEECH_MESSAGE = 'No se detectó voz. Intenta de nuevo.';
const API_ERROR_MESSAGE = 'No pudimos guardar tu recuerdo. Intenta de nuevo en un momento.';
const UNKNOWN_ERROR_MESSAGE = 'Ocurrió un error procesando la grabación.';

export function useRecordingViewModel(onMemoryRecorded?: () => void): RecordingViewModelState {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveText, setLiveText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalLiveTextRef = useRef<string>('');
  // Re-entrancy guard: returns the in-flight stop promise instead of
  // launching a second Voice.stop() / use case execution.
  const isStoppingRef = useRef<boolean>(false);
  const inFlightStopRef = useRef<Promise<StopRecordingResult> | null>(null);

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

  const stopRecording = (): Promise<StopRecordingResult> => {
    if (isStoppingRef.current && inFlightStopRef.current) {
      return inFlightStopRef.current;
    }

    isStoppingRef.current = true;

    const runStop = async (): Promise<StopRecordingResult> => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setIsProcessing(true);

      let result: StopRecordingResult = {
        ok: false,
        reason: 'unknown',
        message: UNKNOWN_ERROR_MESSAGE,
      };
      // Tracks where we are in the flow so the catch block can attribute
      // the failure correctly (voice stop vs. use case execution).
      let stage: 'voice_stop' | 'use_case' = 'voice_stop';

      try {
        await Voice.stop();

        const transcribedText = finalLiveTextRef.current.trim();

        if (!transcribedText) {
          result = { ok: false, reason: 'no_speech', message: NO_SPEECH_MESSAGE };
        } else {
          stage = 'use_case';
          await recordMemoryUseCase.execute(transcribedText);
          if (onMemoryRecorded) onMemoryRecorded();
          result = { ok: true };
        }
      } catch (err) {
        console.error('Failed to stop/process recording', err);
        const reason: StopRecordingReason = stage === 'use_case' ? 'api_error' : 'unknown';
        const message = reason === 'api_error' ? API_ERROR_MESSAGE : UNKNOWN_ERROR_MESSAGE;
        result = { ok: false, reason, message };
      } finally {
        setIsProcessing(false);
        setRecordingSeconds(0);
        setError(result.ok ? null : result.message);
        isStoppingRef.current = false;
        inFlightStopRef.current = null;
      }

      return result;
    };

    const promise = runStop();
    inFlightStopRef.current = promise;
    return promise;
  };

  return {
    isRecording,
    isProcessing,
    recordingSeconds,
    liveText,
    startRecording,
    stopRecording,
    error,
  };
}
