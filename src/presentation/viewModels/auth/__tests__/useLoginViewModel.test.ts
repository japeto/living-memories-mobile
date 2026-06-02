import { renderHook, act } from '@testing-library/react-hooks';
import { useLoginViewModel } from '../useLoginViewModel';

describe('useLoginViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    expect(result.current.email).toBe('');
    expect(result.current.pin).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
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

    act(() => {
      result.current.setPin('1234');
    });
    expect(result.current.pin).toBe('1234');

    // Should ignore non-numeric characters
    act(() => {
      result.current.setPin('12a3');
    });
    expect(result.current.pin).toBe('123');

    // Should not allow more than 4 digits
    act(() => {
      result.current.setPin('123456'); // Rejects changes because replace result is 6 digits (>4)
    });
    expect(result.current.pin).toBe('123'); // Remains previous valid state
  });

  describe('validations', () => {
    it('should validate empty fields on submit', async () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      await act(async () => {
        await result.current.onLogin();
      });

      expect(result.current.emailError).toBe('El correo es requerido.');
      expect(result.current.pinError).toBe('El PIN es requerido.');
      expect(result.current.isLoading).toBe(false);
    });

    it('should invalidate incorrect emails', () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.setEmail('test@.com');
      });
      act(() => {
        result.current.validateEmail();
      });

      expect(result.current.emailError).toBe('El correo no es válido.');
    });

    it('should invalidate non-4-digit PINs but allow weak PINs', () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.setPin('123');
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('El PIN debe tener 4 dígitos.');

      act(() => {
        result.current.setPin('1234'); // Weak pin is now allowed in Login
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('');
      
      act(() => {
        result.current.setPin('1111'); // Weak pin is now allowed in Login
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('');

      act(() => {
        result.current.setPin('1212'); // Weak pin is now allowed in Login
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('');

      act(() => {
        result.current.setPin('5678'); // Good pin
      });
      act(() => {
        result.current.validatePin();
      });
      expect(result.current.pinError).toBe('');
    });
  });

  it('should mock login successfully when fields are valid', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPin('5678');
    });

    await act(async () => {
      const loginPromise = result.current.onLogin();
      jest.advanceTimersByTime(1500);
      await loginPromise;
    });

    expect(result.current.emailError).toBe('');
    expect(result.current.pinError).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should navigate to Register screen when navigateToRegister is called', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.navigateToRegister();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
