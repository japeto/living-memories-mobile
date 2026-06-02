import { useAuth } from '../../providers/AuthProvider';

export const useProfileViewModel = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return {
    handleLogout,
  };
};
