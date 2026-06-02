import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const baseURL: string = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiError {
  message: string;
  status?: number;
}

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
};

export let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredCallback(callback: () => void) {
  onSessionExpired = callback;
}

// State for token refresh queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/api/v1/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post<{ access_token: string; refresh_token: string }>(
          `${baseURL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );

        await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, data.access_token);
        await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err as Error, null);
        
        if (onSessionExpired) {
          onSessionExpired();
        }
        
        const apiError: ApiError = {
          status: error.response?.status,
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
        };
        return Promise.reject(apiError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      status: error.response?.status,
      message: resolveErrorMessage(error),
    };
    return Promise.reject(apiError);
  }
);

function resolveErrorMessage(error: AxiosError): string {
  if (!error.response) {
    return 'Sin conexión a internet';
  }
  switch (error.response.status) {
    case 401:
      return 'Sesión no válida o expirada';
    case 409:
      return 'El correo ya está registrado';
    case 503:
      return 'Servicio no disponible, intenta más tarde';
    default:
      return `Error inesperado (${error.response.status})`;
  }
}
