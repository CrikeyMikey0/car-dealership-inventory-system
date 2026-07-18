import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { tokenService } from '../services/token.service';
import { User } from '../types';
import { notify } from '../utils/notification';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = tokenService.getAccessToken();
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          if (!localStorage.getItem('sessionStartTime')) {
            localStorage.setItem('sessionStartTime', Date.now().toString());
          }
        } else if (!token) {
          localStorage.removeItem('user');
        }
      } catch (err) {
        tokenService.clearTokens();
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }, userData: User) => {
    tokenService.setAccessToken(tokens.accessToken);
    tokenService.setRefreshToken(tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('sessionStartTime', Date.now().toString());
    setUser(userData);
  };

  const logout = () => {
    tokenService.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('sessionStartTime');
    setUser(null);
    notify.info('You have successfully logged out.');
    window.alert('You have successfully logged out.');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

