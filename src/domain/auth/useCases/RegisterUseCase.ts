import { injectable, inject } from 'tsyringe';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

@injectable()
export class RegisterUseCase {
  constructor(@inject('IAuthRepository') private readonly repo: IAuthRepository) {}

  async execute(name: string, email: string, pin: string): Promise<User> {
    const user = await this.repo.register(name, email, pin);
    await this.repo.saveSession(user);
    await this.repo.saveEmail(email);
    return user;
  }
}
