import { Reminder } from '../entities/Reminder';

export interface IReminderRepository {
  getReminders(): Promise<Reminder[]>;
  updateReminderStatus(id: string, is_done: boolean): Promise<void>;
}
