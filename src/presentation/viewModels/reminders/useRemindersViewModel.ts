import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { container } from '../../../di/container';
import { Reminder } from '../../../domain/reminders/entities/Reminder';
import { GetRemindersUseCase } from '../../../domain/reminders/useCases/GetRemindersUseCase';
import { UpdateReminderStatusUseCase } from '../../../domain/reminders/useCases/UpdateReminderStatusUseCase';

export const useRemindersViewModel = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const useCase = container.resolve(GetRemindersUseCase);
      const data = await useCase.execute();
      setReminders(Array.isArray(data) ? data : ((data as any).data || []));
    } catch (err: any) {
      setError(err.message || 'Error al cargar los recordatorios');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const toggleReminderDone = async (reminder: Reminder) => {
    const newStatus = !reminder.is_done;
    
    // Optimistic UI update
    setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, is_done: newStatus } : r));
    
    try {
      const updateUseCase = container.resolve(UpdateReminderStatusUseCase);
      await updateUseCase.execute(reminder.id, newStatus);
    } catch (err) {
      // Revert if request fails
      setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, is_done: reminder.is_done } : r));
    }
  };

  return {
    reminders,
    isLoading,
    error,
    toggleReminderDone,
    refetch: fetchReminders,
  };
};
