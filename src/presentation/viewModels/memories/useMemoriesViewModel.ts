import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { container } from '../../../di/container';
import { GetAllMemoriesUseCase } from '../../../domain/memories/useCases/GetAllMemoriesUseCase';
import { Memory } from '../../../domain/memories/entities/Memory';

export interface MemoriesSection {
  title: string;
  data: Memory[];
}

export const useMemoriesViewModel = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fetchMemories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const useCase = container.resolve(GetAllMemoriesUseCase);
      const data = await useCase.execute();
      setMemories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los recuerdos');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMemories();
    }, [])
  );

  const toggleTopicFilter = (topic: string) => {
    setSelectedTopic(prev => (prev === topic ? null : topic));
  };

  const getFilteredAndGroupedMemories = (): MemoriesSection[] => {
    // Filtrar por topic si hay uno seleccionado
    const filtered = selectedTopic
      ? memories.filter(m => m.topic === selectedTopic)
      : memories;

    // Agrupar por day
    const grouped = filtered.reduce((acc, memory) => {
      const day = memory.day || 'Otros';
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(memory);
      return acc;
    }, {} as Record<string, Memory[]>);

    // Convertir a formato de SectionList
    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));
  };

  // Extraer todos los tópicos únicos de los recuerdos para los CategoryPills
  const availableTopics = Array.from(new Set(memories.map(m => m.topic).filter(Boolean)));

  return {
    isLoading,
    error,
    sections: getFilteredAndGroupedMemories(),
    availableTopics,
    selectedTopic,
    toggleTopicFilter,
    refetch: fetchMemories,
  };
};
