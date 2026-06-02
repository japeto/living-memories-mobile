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
  });

  it('should update email when setEmail is called', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('should update pin and restrict to 4 digits', () => {
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
      result.current.setPin('123456');
    });
    // the previous logic replaces the whole string, but it rejects length > 4 entirely if not truncated
    // Wait, let's look at the implementation:
    // const numericPin = newPin.replace(/[^0-9]/g, '');
    // if (numericPin.length <= 4) { setPin(numericPin); }
    // So '123456' has length 6, so it does nothing! Meaning it keeps the previous pin '123'.
    expect(result.current.pin).toBe('123');
  });

  it('should navigate to Register screen when navigateToRegister is called', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.navigateToRegister();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('should not login if fields are empty or pin is less than 4 digits', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    await act(async () => {
      await result.current.onLogin();
    });
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setEmail('test@test.com');
      result.current.setPin('123');
    });

    await act(async () => {
      await result.current.onLogin();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should mock login successfully when fields are valid', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@test.com');
      result.current.setPin('1234');
    });

    const loginPromise = result.current.onLogin();

    await act(async () => {
      jest.advanceTimersByTime(1500);
      await loginPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
