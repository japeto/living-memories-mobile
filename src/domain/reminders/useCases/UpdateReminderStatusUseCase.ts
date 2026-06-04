import { inject, injectable } from 'tsyringe';
import { IReminderRepository } from '../repositories/IReminderRepository';

@injectable()
export class UpdateReminderStatusUseCase {
  constructor(
    @inject('IReminderRepository') private repository: IReminderRepository
  ) {}

  async execute(id: string, is_done: boolean): Promise<void> {
    return this.repository.updateReminderStatus(id, is_done);
  }
}
