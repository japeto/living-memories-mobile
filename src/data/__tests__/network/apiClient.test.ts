import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Mock expo modules
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiBaseUrl: 'http://localhost:8000',
    },
  },
}));

// Mock axios BEFORE importing apiClient
const mockApiClient = jest.fn().mockResolvedValue('retried-response');
mockApiClient.interceptors = {
  request: { use: jest.fn() },
  response: { use: jest.fn() },
};

jest.mock('axios', () => {
  return {
    create: jest.fn(() => mockApiClient),
    post: jest.fn(),
  };
});

import { apiClient, setSessionExpiredCallback, ApiError } from '../../network/apiClient';

describe('apiClient', () => {
  let requestInterceptor: any;
  let responseInterceptorSuccess: any;
  let responseInterceptorError: any;

  beforeAll(() => {
    // Extract registered interceptors
    const requestCalls = mockApiClient.interceptors.request.use.mock.calls;
    requestInterceptor = requestCalls[0][0];

    const responseCalls = mockApiClient.interceptors.response.use.mock.calls;
    responseInterceptorSuccess = responseCalls[0][0];
    responseInterceptorError = responseCalls[0][1];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setSessionExpiredCallback(() => {}); // Reset callback
  });

  describe('Request Interceptor', () => {
    it('should inject Authorization header if access token exists', async () => {
      // Arrange
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('access-123');
      const config = { headers: {} };

      // Act
      const result = await requestInterceptor(config);

      // Assert
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_access_token');
      expect(result.headers.Authorization).toBe('Bearer access-123');
    });

    it('should not inject Authorization header if access token does not exist', async () => {
      // Arrange
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      const config = { headers: {} };

      // Act
      const result = await requestInterceptor(config);

      // Assert
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses', () => {
      const response = { data: 'success' };
      expect(responseInterceptorSuccess(response)).toBe(response);
    });

    it('should format general error message and reject', async () => {
      // Arrange
      const error = {
        response: { status: 409 },
        config: {},
      };

      // Act & Assert
      await expect(responseInterceptorError(error)).rejects.toEqual({
        status: 409,
        message: 'El correo ya está registrado'
      });
    });

    it('should return network error message if no response', async () => {
      const error = {
        config: {},
      };
      await expect(responseInterceptorError(error)).rejects.toEqual({
        status: undefined,
        message: 'Sin conexión a internet'
      });
    });

    it('should handle 401 error, refresh token, retry original request', async () => {
      // Arrange
      const originalRequest = { url: '/api/v1/protected', headers: {} };
      const error = {
        response: { status: 401 },
        config: originalRequest,
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('refresh-123');
      
      const refreshResponse = {
        data: { access_token: 'new-access', refresh_token: 'new-refresh' }
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(refreshResponse);
      
      // Act
      const result = await responseInterceptorError(error);

      // Assert
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_refresh_token');
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/v1/auth/refresh', {
        refresh_token: 'refresh-123',
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_access_token', 'new-access');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', 'new-refresh');
      expect(originalRequest.headers.Authorization).toBe('Bearer new-access');
      expect(mockApiClient).toHaveBeenCalledWith(originalRequest);
      expect(result).toBe('retried-response');
    });

    it('should call onSessionExpired and reject if refresh token is missing', async () => {
      // Arrange
      const originalRequest = { url: '/api/v1/protected', headers: {} };
      const error = {
        response: { status: 401 },
        config: originalRequest,
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      const mockCallback = jest.fn();
      setSessionExpiredCallback(mockCallback);

      // Act & Assert
      await expect(responseInterceptorError(error)).rejects.toEqual({
        status: 401,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      });
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should call onSessionExpired and reject if refresh API call fails', async () => {
      // Arrange
      const originalRequest = { url: '/api/v1/protected', headers: {} };
      const error = {
        response: { status: 401 },
        config: originalRequest,
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('refresh-123');
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));
      const mockCallback = jest.fn();
      setSessionExpiredCallback(mockCallback);

      // Act & Assert
      await expect(responseInterceptorError(error)).rejects.toEqual({
        status: 401,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      });
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
