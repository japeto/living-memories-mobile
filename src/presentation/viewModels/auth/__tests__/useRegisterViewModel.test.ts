import { renderHook, act } from '@testing-library/react-hooks';
import { useRegisterViewModel } from '../useRegisterViewModel';

const mockLogin = jest.fn();
jest.mock('../../../providers/AuthProvider', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const mockRegisterExecute = jest.fn();
jest.mock('../../../../di/container', () => ({
  container: {
    resolve: jest.fn((token: unknown) => {
      const { RegisterUseCase } = require('../../../../domain/auth/useCases/RegisterUseCase');
      if (token === RegisterUseCase) {
        return { execute: mockRegisterExecute };
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

describe('useRegisterViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    canGoBack: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.pin).toBe('');
    expect(result.current.agree).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.serverError).toBe('');
    expect(result.current.nameError).toBe('');
    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
  });

  it('should clear errors when typing again', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.validateName();
      result.current.validateEmail();
      result.current.validatePin();
    });

    expect(result.current.nameError).not.toBe('');
    expect(result.current.emailError).not.toBe('');
    expect(result.current.pinError).not.toBe('');

    act(() => {
      result.current.setName('J');
      result.current.setEmail('t');
      result.current.setPin('1');
    });

    expect(result.current.nameError).toBe('');
    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
  });

  it('should restrict pin to 4 numeric digits', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setPin('12a3');
    });
    expect(result.current.pin).toBe('123');

    act(() => {
      result.current.setPin('1234');
    });
    expect(result.current.pin).toBe('1234');

    act(() => {
      result.current.setPin('12345');
    });
    expect(result.current.pin).toBe('1234');
  });

  describe('validations', () => {
    it('should validate empty fields on submit', async () => {
      const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

      await act(async () => {
        await result.current.onRegister();
      });

      expect(result.current.nameError).toBe('El nombre es requerido.');
      expect(result.current.emailError).toBe('El correo es requerido.');
      expect(result.current.pinError).toBe('El PIN es requerido.');
      expect(result.current.isLoading).toBe(false);
    });

    it('should invalidate incorrect emails', () => {
      const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

      act(() => {
        result.current.setEmail('test@.com');
      });
      act(() => {
        result.current.validateEmail();
      });

      expect(result.current.emailError).toBe('El correo no es válido.');
    });

    it('should invalidate names with numbers or less than 2 chars', () => {
      const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

      act(() => {
        result.current.setName('A');
      });
      act(() => {
        result.current.validateName();
      });
      expect(result.current.nameError).toBe('El nombre debe tener al menos 2 letras y no contener números.');

      act(() => {
        result.current.setName('Juan123');
      });
      act(() => {
        result.current.validateName();
      });
      expect(result.current.nameError).toBe('El nombre debe tener al menos 2 letras y no contener números.');

      act(() => {
        result.current.setName('Juan');
      });
      act(() => {
        result.current.validateName();
      });
      expect(result.current.nameError).toBe('');
    });

    it('should invalidate weak PINs and non-4-digit PINs', () => {
      const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

      act(() => {
        result.current.setPin('123');
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('El PIN debe tener 4 dígitos.');

      act(() => {
        result.current.setPin('4321');
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('El PIN es demasiado fácil de adivinar.');

      act(() => {
        result.current.setPin('5678');
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('');
    });
  });

  it('should navigate back to Login if canGoBack is false', () => {
    mockNavigation.canGoBack.mockReturnValue(false);
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.goBack();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });

  it('should go back if canGoBack is true', () => {
    mockNavigation.canGoBack.mockReturnValue(true);
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.goBack();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should navigate to Login when navigateToLogin is called', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.navigateToLogin();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('should not register if agreement is not checked', async () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setName('Juan');
      result.current.setEmail('valid@example.com');
      result.current.setPin('5678');
      result.current.setAgree(false);
    });

    await act(async () => {
      await result.current.onRegister();
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockRegisterExecute).not.toHaveBeenCalled();
  });

  it('should register successfully when fields are valid and agree is true', async () => {
    mockRegisterExecute.mockResolvedValueOnce({ userId: 'user-123' });

    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setName('Juan');
      result.current.setEmail('valid@example.com');
      result.current.setPin('5678');
      result.current.setAgree(true);
    });

    await act(async () => {
      await result.current.onRegister();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.serverError).toBe('');
    expect(mockLogin).toHaveBeenCalledWith('user-123');
  });

  it('should set serverError when register fails with API error', async () => {
    mockRegisterExecute.mockRejectedValueOnce({ message: 'El correo ya está registrado', status: 409 });

    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setName('Juan');
      result.current.setEmail('valid@example.com');
      result.current.setPin('5678');
      result.current.setAgree(true);
    });

    await act(async () => {
      await result.current.onRegister();
    });

    expect(result.current.serverError).toBe('El correo ya está registrado');
    expect(result.current.isLoading).toBe(false);
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
