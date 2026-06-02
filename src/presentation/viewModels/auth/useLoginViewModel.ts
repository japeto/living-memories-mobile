import { useState } from 'react';

export interface LoginViewModel {
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  isLoading: boolean;
  onLogin: () => Promise<void>;
  navigateToRegister: () => void;
}

export function useLoginViewModel(navigation: any): LoginViewModel {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !pin || pin.length < 4) {
      return;
    }
    setIsLoading(true);
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // In the future: replace this with actual auth state update
    // e.g. authContext.login()
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return {
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
    isLoading,
    onLogin,
    navigateToRegister,
  };
}
