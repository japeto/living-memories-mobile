import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { container } from '../../di/container';
import { RestoreSessionUseCase } from '../../domain/auth/useCases/RestoreSessionUseCase';
import { AuthRepository } from '../../data/auth/repositories/AuthRepository';
import { setSessionExpiredCallback } from '../../data/network/apiClient';
import { User } from '../../domain/auth/entities/User';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userId: string | null;
  userName: string | null;
  isRestoringSession: boolean;
  login: (userId: string, userName?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);

  const userId = user?.userId ?? null;
  const userName = user?.displayName ?? null;

  useEffect(() => {
    // Register the force logout callback for the API client
    setSessionExpiredCallback(() => {
      logout();
    });

    const restoreSession = container.resolve(RestoreSessionUseCase);
    restoreSession
      .execute()
      .then((restoredUser) => {
        if (restoredUser) {
          setUser({
            ...restoredUser,
            email: 'rosa.mendez@correo.com',
            createdAt: '2026-05-01T10:00:00.000Z',
            preferredName: 'Rosa',
            isEmailVerified: true,
          });
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

  const login = (id: string, name?: string) => {
    setUser({
      userId: id,
      displayName: name,
      email: 'rosa.mendez@correo.com',
      createdAt: '2026-05-01T10:00:00.000Z',
      preferredName: 'Rosa',
      isEmailVerified: true,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    const repo = container.resolve(AuthRepository);
    repo.clearSession().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userId, userName, isRestoringSession, login, logout }}>
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
