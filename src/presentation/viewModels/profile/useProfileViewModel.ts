import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';

export const useProfileViewModel = () => {
  const { user, logout } = useAuth();
  const [preferredNameInput, setPreferredNameInput] = useState<string>('');

  useEffect(() => {
    if (user?.preferredName) {
      setPreferredNameInput(user.preferredName);
    }
  }, [user?.preferredName]);

  const handleLogout = async () => {
    await logout();
  };

  return {
    user,
    preferredNameInput,
    setPreferredNameInput,
    handleLogout,
  };
};
