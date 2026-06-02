import { injectable, inject } from 'tsyringe';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

@injectable()
export class RestoreSessionUseCase {
  constructor(@inject('IAuthRepository') private readonly repo: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return this.repo.getStoredSession();
  }
}
