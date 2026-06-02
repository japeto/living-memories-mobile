import { injectable } from 'tsyringe';
import * as SecureStore from 'expo-secure-store';
import { IAuthRepository } from '../../../domain/auth/repositories/IAuthRepository';
import { User } from '../../../domain/auth/entities/User';
import { apiClient, ApiError } from '../../network/apiClient';

const KEYS = {
  USER_ID: 'auth_user_id',
  EMAIL: 'auth_email',
} as const;

interface RegisterResponseDTO {
  user_id: string;
  display_name: string;
  email: string;
}

interface LoginResponseDTO {
  authenticated: boolean;
  user_id: string;
}

@injectable()
export class AuthRepository implements IAuthRepository {
  async register(name: string, email: string, pin: string): Promise<User> {
    try {
      const { data } = await apiClient.post<RegisterResponseDTO>('/api/v1/auth/register', {
        display_name: name,
        email,
        pin,
        conditions_accepted: true,
      });
      return { userId: data.user_id };
    } catch (error) {
      throw error as ApiError;
    }
  }

  async login(email: string, pin: string): Promise<User> {
    try {
      const { data } = await apiClient.post<LoginResponseDTO>('/api/v1/auth/login', {
        email,
        pin,
      });
      return { userId: data.user_id };
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getStoredSession(): Promise<User | null> {
    const userId = await SecureStore.getItemAsync(KEYS.USER_ID);
    if (!userId) return null;
    return { userId };
  }

  async saveSession(user: User): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, user.userId);
  }

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.USER_ID);
    await SecureStore.deleteItemAsync(KEYS.EMAIL);
  }

  async getStoredEmail(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.EMAIL);
  }

  async saveEmail(email: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.EMAIL, email);
  }
}
