import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../di/container';
import { GetWeeklyWellnessUseCase } from '../../../domain/wellness/useCases/GetWeeklyWellnessUseCase';
import { WellnessData } from '../../../domain/wellness/entities/WellnessData';

export function useWellnessViewModel() {
  const [data, setData] = useState<WellnessData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const useCase = container.resolve(GetWeeklyWellnessUseCase);
      const result = await useCase.execute();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el bienestar.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
