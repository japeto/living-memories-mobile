import 'reflect-metadata';
import { AuthRepository } from '../../../auth/repositories/AuthRepository';
import { apiClient } from '../../../network/apiClient';
import * as SecureStore from 'expo-secure-store';

jest.mock('../../../network/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('AuthRepository', () => {
  let repository: AuthRepository;

  beforeEach(() => {
    repository = new AuthRepository();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user, store tokens and return userId', async () => {
      // Arrange
      const mockResponse = {
        data: {
          user_id: 'user-123',
          display_name: 'Test',
          email: 'test@example.com',
          access_token: 'access-123',
          refresh_token: 'refresh-123',
          token_type: 'bearer',
        }
      };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await repository.register('Test', 'test@example.com', '1234');

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/register', {
        display_name: 'Test',
        email: 'test@example.com',
        pin: '1234',
        conditions_accepted: true,
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_access_token', 'access-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', 'refresh-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_display_name', 'Test');
      expect(result).toEqual({ userId: 'user-123', displayName: 'Test' });
    });
  });

  describe('login', () => {
    it('should login, store tokens and return userId', async () => {
      // Arrange
      const mockResponse = {
        data: {
          authenticated: true,
          user_id: 'user-123',
          display_name: 'Juan',
          access_token: 'access-123',
          refresh_token: 'refresh-123',
          token_type: 'bearer',
        }
      };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await repository.login('test@example.com', '1234');

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/login', {
        email: 'test@example.com',
        pin: '1234',
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_access_token', 'access-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', 'refresh-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_display_name', 'Juan');
      expect(result).toEqual({ userId: 'user-123', displayName: 'Juan' });
    });
  });

  describe('getStoredSession', () => {
    it('should return User if userId and refreshToken exist in store', async () => {
      // Arrange
      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === 'auth_user_id') return Promise.resolve('user-123');
        if (key === 'auth_refresh_token') return Promise.resolve('refresh-123');
        if (key === 'auth_display_name') return Promise.resolve('Juan');
        return Promise.resolve(null);
      });

      // Act
      const result = await repository.getStoredSession();

      // Assert
      expect(result).toEqual({ userId: 'user-123', displayName: 'Juan' });
    });

    it('should return null if refreshToken is missing', async () => {
      // Arrange
      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === 'auth_user_id') return Promise.resolve('user-123');
        if (key === 'auth_refresh_token') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      // Act
      const result = await repository.getStoredSession();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('saveSession', () => {
    it('should save userId to store', async () => {
      // Act
      await repository.saveSession({ userId: 'user-123', displayName: 'Juan' });

      // Assert
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_user_id', 'user-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_display_name', 'Juan');
    });
  });

  describe('clearSession', () => {
    it('should logout and clear all stored items', async () => {
      // Arrange
      (apiClient.post as jest.Mock).mockResolvedValueOnce({});

      // Act
      await repository.clearSession();

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/logout');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user_id');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_email');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_display_name');
    });

    it('should clear stored items even if logout request fails', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Act
      await repository.clearSession();

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/logout');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user_id');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('email handling', () => {
    it('should get stored email', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('test@example.com');
      const result = await repository.getStoredEmail();
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_email');
      expect(result).toBe('test@example.com');
    });

    it('should save email', async () => {
      await repository.saveEmail('test@example.com');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_email', 'test@example.com');
    });
  });
});
