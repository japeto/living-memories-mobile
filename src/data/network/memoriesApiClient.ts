import { apiClient } from './apiClient';
import { Memory } from '../../domain/memories/entities/Memory';

export const uploadMemory = async (transcribedText: string): Promise<Memory> => {
  const response = await apiClient.post<Memory>('/api/v1/memories/upload', {
    transcribed_text: transcribedText
  });

  return response.data;
};
