import { useState, useEffect, useRef } from 'react';
import { container } from '../../../di/container';
import { Memory } from '../../../domain/memories/entities/Memory';
import { GetTodayMemoriesUseCase } from '../../../domain/memories/useCases/GetTodayMemoriesUseCase';
import { ProcessNewMemoryUseCase } from '../../../domain/memories/useCases/ProcessNewMemoryUseCase';

export interface HomeViewModelState {
  memories: Memory[];
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  layerStep: number;
  newId: number | null;
  onToggleRecord: () => void;
  isLoading: boolean;
}

export function useHomeViewModel(): HomeViewModelState {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [phase, setPhase] = useState<'idle' | 'rec' | 'proc'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [layerStep, setLayerStep] = useState(0);
  const [newId, setNewId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We resolve the use cases outside of useEffect so they can be mocked in tests if needed
  const getTodayMemoriesUseCase = container.resolve(GetTodayMemoriesUseCase);
  const processNewMemoryUseCase = container.resolve(ProcessNewMemoryUseCase);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const layerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchMemories();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);
    };
  }, []);

  const fetchMemories = async () => {
    try {
      setIsLoading(true);
      const data = await getTodayMemoriesUseCase.execute();
      setMemories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    setPhase('rec');
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setPhase('proc');
    setLayerStep(0);
    setNewId(null);
    simulateProcessing();
  };

  const simulateProcessing = () => {
    // Step through layers
    layerIntervalRef.current = setInterval(() => {
      setLayerStep((prev) => {
        if (prev >= 4) {
          if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    // Call UseCase
    processNewMemoryUseCase.execute()
      .then((newMem) => {
        // Delay enough to show the layer steps animation
        setTimeout(() => {
          setMemories((prev) => [newMem, ...prev]);
          setNewId(newMem.id);
          setPhase('idle');
          setSeconds(0);
          setLayerStep(0);
        }, 3200); 
      })
      .catch((error) => {
        console.error(error);
        setPhase('idle');
      });
  };

  const onToggleRecord = () => {
    if (phase === 'idle') {
      startRecording();
    } else if (phase === 'rec') {
      stopRecording();
    }
  };

  return {
    memories,
    phase,
    seconds,
    layerStep,
    newId,
    onToggleRecord,
    isLoading
  };
}
