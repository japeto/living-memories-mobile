import { injectable } from 'tsyringe';
import * as SecureStore from 'expo-secure-store';
import { IAuthRepository } from '../../../domain/auth/repositories/IAuthRepository';
import { User } from '../../../domain/auth/entities/User';
import { apiClient, ApiError } from '../../network/apiClient';

const KEYS = {
  USER_ID: 'auth_user_id',
  EMAIL: 'auth_email',
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  DISPLAY_NAME: 'auth_display_name',
} as const;

interface RegisterResponseDTO {
  user_id: string;
  display_name: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface LoginResponseDTO {
  authenticated: boolean;
  user_id: string;
  display_name: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
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
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, data.access_token);
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, data.refresh_token);
      if (data.display_name) {
        await SecureStore.setItemAsync(KEYS.DISPLAY_NAME, data.display_name);
      }
      return { userId: data.user_id, displayName: data.display_name };
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
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, data.access_token);
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, data.refresh_token);
      if (data.display_name) {
        await SecureStore.setItemAsync(KEYS.DISPLAY_NAME, data.display_name);
      }
      return { userId: data.user_id, displayName: data.display_name };
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getStoredSession(): Promise<User | null> {
    const userId = await SecureStore.getItemAsync(KEYS.USER_ID);
    const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    const displayName = await SecureStore.getItemAsync(KEYS.DISPLAY_NAME);
    if (!userId || !refreshToken) return null;
    return { userId, ...(displayName ? { displayName } : {}) };
  }

  async saveSession(user: User): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, user.userId);
    if (user.displayName) {
      await SecureStore.setItemAsync(KEYS.DISPLAY_NAME, user.displayName);
    }
  }

  async clearSession(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.warn('Logout request failed or user already logged out', error);
    }
    await SecureStore.deleteItemAsync(KEYS.USER_ID);
    await SecureStore.deleteItemAsync(KEYS.EMAIL);
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.DISPLAY_NAME);
  }

  async getStoredEmail(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.EMAIL);
  }

  async saveEmail(email: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.EMAIL, email);
  }
}
