import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { container } from '../../../di/container';
import { RegisterUseCase } from '../../../domain/auth/useCases/RegisterUseCase';
import { ApiError } from '../../../data/network/apiClient';

export interface RegisterViewModel {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  agree: boolean;
  setAgree: (agree: boolean) => void;
  isLoading: boolean;
  serverError: string;
  onRegister: () => Promise<void>;
  navigateToLogin: () => void;
  goBack: () => void;
  nameError: string;
  emailError: string;
  pinError: string;
  validateName: () => boolean;
  validateEmail: () => boolean;
  validatePin: () => boolean;
}

export function useRegisterViewModel(navigation: any): RegisterViewModel {
  const [name, setNameState] = useState('');
  const [email, setEmailState] = useState('');
  const [pin, setPinState] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pinError, setPinError] = useState('');

  const validateName = () => {
    if (!name) {
      setNameError('El nombre es requerido.');
      return false;
    }
    const nameRegex = /^[^0-9]{2,}$/;
    if (!nameRegex.test(name)) {
      setNameError('El nombre debe tener al menos 2 letras y no contener números.');
      return false;
    }
    setNameError('');
    return true;
  };

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
    const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '1212'];
    if (weakPins.includes(pin)) {
      setPinError('El PIN es demasiado fácil de adivinar.');
      return false;
    }
    setPinError('');
    return true;
  };

  const onRegister = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPinValid = validatePin();

    if (!isNameValid || !isEmailValid || !isPinValid || !agree) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const registerUseCase = container.resolve(RegisterUseCase);
      const user = await registerUseCase.execute(name, email, pin);
      login(user.userId);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message ?? 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  return {
    name,
    setName: (newName) => {
      setNameState(newName);
      if (nameError) setNameError('');
    },
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
    agree,
    setAgree,
    isLoading,
    serverError,
    onRegister,
    navigateToLogin,
    goBack,
    nameError,
    emailError,
    pinError,
    validateName,
    validateEmail,
    validatePin,
  };
}
