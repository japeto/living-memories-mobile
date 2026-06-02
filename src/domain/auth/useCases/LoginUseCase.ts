import { injectable, inject } from 'tsyringe';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

@injectable()
export class LoginUseCase {
  constructor(@inject('IAuthRepository') private readonly repo: IAuthRepository) {}

  async execute(email: string, pin: string): Promise<User> {
    const user = await this.repo.login(email, pin);
    await this.repo.saveSession(user);
    return user;
  }
}
