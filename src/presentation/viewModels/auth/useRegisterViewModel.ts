import { useState } from 'react';

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
  onRegister: () => Promise<void>;
  navigateToLogin: () => void;
  goBack: () => void;
}

export function useRegisterViewModel(navigation: any): RegisterViewModel {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !pin || pin.length < 4 || !agree) {
      return;
    }
    setIsLoading(true);
    // Mock register delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // In the future: replace this with actual register flow
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
    setName,
    email,
    setEmail,
    pin,
    setPin: (newPin) => {
      // Allow only numbers and up to 4 digits
      const numericPin = newPin.replace(/[^0-9]/g, '');
      if (numericPin.length <= 4) {
        setPin(numericPin);
      }
    },
    agree,
    setAgree,
    isLoading,
    onRegister,
    navigateToLogin,
    goBack,
  };
}
