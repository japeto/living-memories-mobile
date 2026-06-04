import { inject, injectable } from 'tsyringe';
import { IReminderRepository } from '../repositories/IReminderRepository';
import { Reminder } from '../entities/Reminder';

@injectable()
export class GetRemindersUseCase {
  constructor(
    @inject('IReminderRepository') private repository: IReminderRepository
  ) {}

  async execute(): Promise<Reminder[]> {
    return this.repository.getReminders();
  }
}
