import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { container } from '../../../di/container';
import { LoginUseCase } from '../../../domain/auth/useCases/LoginUseCase';
import { AUTH_TOKENS } from '../../../di/tokens';
import type { IAuthRepository } from '../../../domain/auth/repositories/IAuthRepository';
import { ApiError } from '../../../data/network/apiClient';

export interface LoginViewModel {
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  isLoading: boolean;
  serverError: string;
  onLogin: () => Promise<void>;
  navigateToRegister: () => void;
  emailError: string;
  pinError: string;
  validateEmail: () => boolean;
  validatePin: () => boolean;
}

export function useLoginViewModel(navigation: any): LoginViewModel {
  const [email, setEmailState] = useState('');
  const [pin, setPinState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pinError, setPinError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    const repo = container.resolve<IAuthRepository>(AUTH_TOKENS.IAuthRepository);
    repo.getStoredEmail().then((storedEmail) => {
      if (storedEmail) setEmailState(storedEmail);
    });
  }, []);

  const validateEmail = () => {
    if (!email) {
      setEmailError('El correo es requerido.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('El correo no es válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePin = () => {
    if (!pin) {
      setPinError('El PIN es requerido.');
      return false;
    }
    if (pin.length !== 4) {
      setPinError('El PIN debe tener 4 dígitos.');
      return false;
    }
    setPinError('');
    return true;
  };

  const onLogin = async () => {
    const isEmailValid = validateEmail();
    const isPinValid = validatePin();
    if (!isEmailValid || !isPinValid) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const loginUseCase = container.resolve(LoginUseCase);
      const user = await loginUseCase.execute(email, pin);
      login(user.userId, user.displayName);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message ?? 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return {
    email,
    setEmail: (newEmail) => {
      setEmailState(newEmail);
      if (emailError) setEmailError('');
    },
    pin,
    setPin: (newPin) => {
      const numericPin = newPin.replace(/[^0-9]/g, '');
      if (numericPin.length <= 4) {
        setPinState(numericPin);
        if (pinError) setPinError('');
      }
    },
    isLoading,
    serverError,
    onLogin,
    navigateToRegister,
    emailError,
    pinError,
    validateEmail,
    validatePin,
  };
}
