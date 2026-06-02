import { renderHook, act } from '@testing-library/react-hooks';

const mockLogin = jest.fn();
const mockLoginExecute = jest.fn();
const mockGetStoredSession = jest.fn();
const mockGetStoredEmail = jest.fn();

jest.mock('../../../providers/AuthProvider', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('../../../../domain/auth/useCases/LoginUseCase', () => ({
  LoginUseCase: class MockLoginUseCase {},
}));

jest.mock('../../../../data/network/apiClient', () => ({
  ApiError: class ApiError extends Error {},
}));

jest.mock('../../../../di/tokens', () => ({
  AUTH_TOKENS: { IAuthRepository: 'IAuthRepository' },
}));

jest.mock('../../../../di/container', () => ({
  container: {
    resolve: jest.fn((token: unknown) => {
      const name = typeof token === 'function' ? token.name : String(token);
      if (name === 'MockLoginUseCase' || name === 'LoginUseCase') {
        return { execute: mockLoginExecute };
      }
      if (name === 'IAuthRepository') {
        return {
          getStoredSession: mockGetStoredSession,
          getStoredEmail: mockGetStoredEmail,
        };
      }
      return {};
    }),
  },
}));

jest.mock('expo-constants', () => ({
  default: { expoConfig: { extra: { apiBaseUrl: 'http://localhost:8000' } } },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { useLoginViewModel } from '../useLoginViewModel';

describe('useLoginViewModel', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredEmail.mockResolvedValue(null);
    mockGetStoredSession.mockResolvedValue(null);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    expect(result.current.email).toBe('');
    expect(result.current.pin).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.serverError).toBe('');
    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
  });

  it('should prefill email from stored session', async () => {
    mockGetStoredEmail.mockResolvedValueOnce('stored@example.com');
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.email).toBe('stored@example.com');
  });

  it('should clear errors when typing again', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    act(() => {
      result.current.validateEmail();
      result.current.validatePin();
    });
    expect(result.current.emailError).not.toBe('');
    expect(result.current.pinError).not.toBe('');
    act(() => {
      result.current.setEmail('t');
      result.current.setPin('1');
    });
    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
  });

  it('should restrict pin to numeric and max 4 digits', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    act(() => { result.current.setPin('1234'); });
    expect(result.current.pin).toBe('1234');
    act(() => { result.current.setPin('12a3'); });
    expect(result.current.pin).toBe('123');
    act(() => { result.current.setPin('123456'); });
    expect(result.current.pin).toBe('123');
  });

  describe('validations', () => {
    it('should validate empty fields on submit', async () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));
      await act(async () => { await result.current.onLogin(); });
      expect(result.current.emailError).toBe('El correo es requerido.');
      expect(result.current.pinError).toBe('El PIN es requerido.');
      expect(result.current.isLoading).toBe(false);
    });

    it('should invalidate incorrect emails', () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));
      act(() => { result.current.setEmail('test@.com'); });
      act(() => { result.current.validateEmail(); });
      expect(result.current.emailError).toBe('El correo no es válido.');
    });

    it('should invalidate non-4-digit PINs but allow weak PINs', () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));
      act(() => { result.current.setPin('123'); });
      act(() => { result.current.validatePin(); });
      expect(result.current.pinError).toBe('El PIN debe tener 4 dígitos.');
      act(() => { result.current.setPin('1234'); });
      act(() => { result.current.validatePin(); });
      expect(result.current.pinError).toBe('');
      act(() => { result.current.setPin('1111'); });
      act(() => { result.current.validatePin(); });
      expect(result.current.pinError).toBe('');
    });
  });

  it('should login successfully when stored userId exists', async () => {
    mockLoginExecute.mockResolvedValueOnce({ userId: 'stored-user-id', displayName: 'Juan' });
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPin('5678');
    });
    await act(async () => { await result.current.onLogin(); });
    expect(result.current.serverError).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(mockLogin).toHaveBeenCalledWith('stored-user-id', 'Juan');
  });

  it('should set serverError when login API fails', async () => {
    mockLoginExecute.mockRejectedValueOnce({ message: 'Sin conexión a internet' });
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPin('5678');
    });
    await act(async () => { await result.current.onLogin(); });
    expect(result.current.serverError).toBe('Sin conexión a internet');
    expect(result.current.isLoading).toBe(false);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should navigate to Register screen when navigateToRegister is called', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));
    act(() => { result.current.navigateToRegister(); });
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
