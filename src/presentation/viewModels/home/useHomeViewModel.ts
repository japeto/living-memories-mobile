import { useState, useEffect, useRef } from 'react';
import { container } from '../../../di/container';
import { Memory } from '../../../domain/memories/entities/Memory';
import { GetTodayMemoriesUseCase } from '../../../domain/memories/useCases/GetTodayMemoriesUseCase';
import { useRecordingViewModel } from './useRecordingViewModel';

export interface HomeViewModelState {
  memories: Memory[];
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  layerStep: number;
  newId: string | null;
  onToggleRecord: () => void;
  isLoading: boolean;
  liveText: string;
  errorMessage: string | null;
  dismissError: () => void;
}

const UNKNOWN_ERROR_MESSAGE = 'Ocurrió un error procesando la grabación.';

export function useHomeViewModel(): HomeViewModelState {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [phase, setPhase] = useState<'idle' | 'rec' | 'proc'>('idle');
  const [layerStep, setLayerStep] = useState(0);
  const [newId, setNewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getTodayMemoriesUseCase = container.resolve(GetTodayMemoriesUseCase);

  const layerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onMemoryRecorded = () => {
    // When the real recording is done and processed, we fetch memories again
    // For now, to keep the UI smooth, we might just mock the layers
    setLayerStep(4);
    setTimeout(() => {
      fetchMemories();
      setPhase('idle');
      setLayerStep(0);
    }, 1000);
  };

  const recordingVM = useRecordingViewModel(onMemoryRecorded);

  useEffect(() => {
    fetchMemories(true);
    return () => {
      if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const hasProcessing = memories.some(m => m.status === 'processing');
    let interval: ReturnType<typeof setInterval>;
    if (hasProcessing) {
      interval = setInterval(() => {
        fetchMemories(false);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [memories]);

  const fetchMemories = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const data = await getTodayMemoriesUseCase.execute();
      setMemories(data);
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const startRecording = async () => {
    await recordingVM.startRecording();
    setPhase('rec');
  };

  const stopRecording = async () => {
    setPhase('proc');
    setLayerStep(0);
    setNewId(null);
    setErrorMessage(null);
    simulateProcessingUI();

    try {
      const result = await recordingVM.stopRecording();

      if (!result.ok) {
        if (layerIntervalRef.current) {
          clearInterval(layerIntervalRef.current);
          layerIntervalRef.current = null;
        }
        setLayerStep(0);
        setPhase('idle');
        setErrorMessage(result.message);
      }
      // Happy path is handled by onMemoryRecorded which is fired from inside
      // recordingVM.stopRecording before it resolves.
    } catch (err) {
      // Safety net: recordingVM.stopRecording is expected to swallow its own
      // errors and return a result, but if it throws we still recover the UI.
      console.error('Unexpected error during stopRecording', err);
      if (layerIntervalRef.current) {
        clearInterval(layerIntervalRef.current);
        layerIntervalRef.current = null;
      }
      setLayerStep(0);
      setPhase('idle');
      setErrorMessage(UNKNOWN_ERROR_MESSAGE);
    }
  };

  const simulateProcessingUI = () => {
    // Step through layers visually while the actual processing happens
    layerIntervalRef.current = setInterval(() => {
      setLayerStep((prev) => {
        if (prev >= 4) {
          if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const onToggleRecord = () => {
    if (phase === 'idle') {
      startRecording();
    } else if (phase === 'rec') {
      stopRecording();
    }
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  return {
    memories,
    phase,
    seconds: recordingVM.recordingSeconds,
    layerStep,
    newId,
    onToggleRecord,
    isLoading,
    liveText: recordingVM.liveText,
    errorMessage,
    dismissError,
  };
}
