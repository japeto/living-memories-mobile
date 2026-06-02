import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';

export interface LoginViewModel {
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  isLoading: boolean;
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
  const [emailError, setEmailError] = useState('');
  const [pinError, setPinError] = useState('');
  const { login } = useAuth();

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
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Trigger authentication state update
    login();
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
      // Allow only numbers and up to 4 digits
      const numericPin = newPin.replace(/[^0-9]/g, '');
      if (numericPin.length <= 4) {
        setPinState(numericPin);
        if (pinError) setPinError('');
      }
    },
    isLoading,
    onLogin,
    navigateToRegister,
    emailError,
    pinError,
    validateEmail,
    validatePin,
  };
}
