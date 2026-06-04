import { apiClient } from './apiClient';
import { Reminder } from '../../domain/reminders/entities/Reminder';

export const getReminders = async (): Promise<Reminder[]> => {
  const response = await apiClient.get<Reminder[]>('/api/v1/reminders');
  return response.data;
};

export const updateReminderStatus = async (id: string, is_done: boolean): Promise<void> => {
  await apiClient.patch(`/api/v1/reminders/${id}`, { is_done });
};
