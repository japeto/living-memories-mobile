import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { container } from '../../di/container';
import { RestoreSessionUseCase } from '../../domain/auth/useCases/RestoreSessionUseCase';
import { AuthRepository } from '../../data/auth/repositories/AuthRepository';
import { setSessionExpiredCallback } from '../../data/network/apiClient';

export interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  isRestoringSession: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);

  useEffect(() => {
    // Register the force logout callback for the API client
    setSessionExpiredCallback(() => {
      logout();
    });

    const restoreSession = container.resolve(RestoreSessionUseCase);
    restoreSession
      .execute()
      .then((user) => {
        if (user) {
          setUserId(user.userId);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // No stored session — stay unauthenticated
      })
      .finally(() => {
        setIsRestoringSession(false);
      });
  }, []);

  const login = (id: string) => {
    setUserId(id);
    setIsAuthenticated(true);
  };

  const logout = () => {
    const repo = container.resolve(AuthRepository);
    repo.clearSession().catch(() => {});
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isRestoringSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
