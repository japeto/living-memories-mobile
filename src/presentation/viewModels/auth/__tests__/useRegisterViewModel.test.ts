import { renderHook, act } from '@testing-library/react-hooks';
import { useRegisterViewModel } from '../useRegisterViewModel';

describe('useRegisterViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    canGoBack: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.pin).toBe('');
    expect(result.current.agree).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should update fields correctly', () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setName('Juan Perez');
      result.current.setEmail('test@example.com');
      result.current.setAgree(true);
    });

    expect(result.current.name).toBe('Juan Perez');
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.agree).toBe(true);
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

    // Trying to add a 5th digit does nothing since length check fails
    act(() => {
      result.current.setPin('12345');
    });
    expect(result.current.pin).toBe('1234');
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

  it('should not register if validation fails', async () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    await act(async () => {
      await result.current.onRegister();
    });
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setName('Juan');
      result.current.setEmail('a@a.com');
      result.current.setPin('123'); // Invalid pin length
      result.current.setAgree(true);
    });

    await act(async () => {
      await result.current.onRegister();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should register successfully when fields are valid', async () => {
    const { result } = renderHook(() => useRegisterViewModel(mockNavigation));

    act(() => {
      result.current.setName('Juan');
      result.current.setEmail('a@a.com');
      result.current.setPin('1234');
      result.current.setAgree(true);
    });

    await act(async () => {
      const registerPromise = result.current.onRegister();
      jest.advanceTimersByTime(1500);
      await registerPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
