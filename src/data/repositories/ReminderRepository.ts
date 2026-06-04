import { IReminderRepository } from '../../domain/reminders/repositories/IReminderRepository';
import { Reminder } from '../../domain/reminders/entities/Reminder';
import { getReminders, updateReminderStatus } from '../network/remindersApiClient';

export class ReminderRepository implements IReminderRepository {
  async getReminders(): Promise<Reminder[]> {
    return await getReminders();
  }

  async updateReminderStatus(id: string, is_done: boolean): Promise<void> {
    return await updateReminderStatus(id, is_done);
  }
}
