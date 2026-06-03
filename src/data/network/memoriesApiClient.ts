import { apiClient } from './apiClient';
import { Memory } from '../../domain/memories/entities/Memory';

// The backend returns a schema with created_at, which we map to day and time.
export interface MemoryResponse {
  id: string;
  user_id: string;
  text: string;
  topic: string;
  mood: string;
  reminder?: string;
  created_at: string;
}

const mapMemoryResponseToMemory = (response: MemoryResponse): Memory => {
  const date = new Date(response.created_at);
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  
  // Format day as "Hoy" if it's today, otherwise localized string, for simplicity let's just use a basic check or date string
  const today = new Date();
  let dayStr = date.toLocaleDateString();
  if (date.toDateString() === today.toDateString()) {
    dayStr = 'Hoy';
  } else if (
    date.getDate() === today.getDate() - 1 &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    dayStr = 'Ayer';
  }

  return {
    id: response.id,
    time: date.toLocaleTimeString([], timeOptions),
    day: dayStr,
    text: response.text,
    topic: response.topic,
    mood: response.mood,
    reminder: response.reminder,
  };
};

export const uploadMemory = async (text: string): Promise<Memory> => {
  const response = await apiClient.post<MemoryResponse>('/api/v1/memories/upload', {
    text
  });

  return mapMemoryResponseToMemory(response.data);
};

export const getMemories = async (): Promise<Memory[]> => {
  const response = await apiClient.get<MemoryResponse[]>('/api/v1/memories');
  return response.data.map(mapMemoryResponseToMemory);
};
