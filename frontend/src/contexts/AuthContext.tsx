import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { tokenService } from '../services/token.service';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = tokenService.getAccessToken();
        if (token) {
          // If token exists in localStorage, initialize auth state. In real app, /me call would happen.
        }
      } catch (err) {
        tokenService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }, userData: User) => {
    tokenService.setAccessToken(tokens.accessToken);
    tokenService.setRefreshToken(tokens.refreshToken);
    setUser(userData);
  };

  const logout = () => {
    tokenService.clearTokens();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
