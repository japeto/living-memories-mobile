import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
    case 409:
      return 'El correo ya está registrado';
    case 503:
      return 'Servicio no disponible, intenta más tarde';
    default:
      return `Error inesperado (${error.response.status})`;
  }
}
