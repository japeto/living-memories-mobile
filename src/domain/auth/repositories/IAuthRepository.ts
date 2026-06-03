import { User } from '../entities/User';

export interface IAuthRepository {
  register(name: string, email: string, pin: string): Promise<User>;
  login(email: string, pin: string): Promise<User>;
  getStoredSession(): Promise<User | null>;
  saveSession(user: User): Promise<void>;
  clearSession(): Promise<void>;
  getStoredEmail(): Promise<string | null>;
  saveEmail(email: string): Promise<void>;
}
