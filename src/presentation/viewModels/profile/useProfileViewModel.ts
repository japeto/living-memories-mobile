import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { container } from '../../../di/container';
import { GetProfileUseCase } from '../../../domain/profile/useCases/GetProfileUseCase';
import { UserProfile } from '../../../domain/profile/entities/UserProfile';

export const useProfileViewModel = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const getProfileUseCase = container.resolve(GetProfileUseCase);
      const data = await getProfileUseCase.execute();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await logout();
  };

  return {
    profile,
    isLoading,
    error,
    handleLogout,
    refetch: fetchProfile,
  };
};
