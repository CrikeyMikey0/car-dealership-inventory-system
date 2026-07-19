/**
 * @file AuthContext.tsx
 * @description React context and provider for global authentication state.
 *
 * Manages the authenticated user's identity and the associated JWT tokens.
 * Persists state across page refreshes via `localStorage`.
 *
 * On mount, the provider reads the stored access token and user data from
 * `localStorage` and hydrates the React state so the user does not need to
 * log in again after a page reload.
 *
 * Exposed via the `AuthContext` context object.  Use the `useAuth` hook
 * (defined in `hooks/useAuth.ts`) to consume the context in components.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { tokenService } from '../services/token.service';
import { User } from '../types';
import { notify } from '../utils/notification';

/**
 * Shape of the authentication context value provided to consumers.
 */
export interface AuthContextType {
  /** The currently authenticated user, or `null` if not logged in. */
  user: User | null;
  /** `true` when `user` is non-null (convenience derived flag). */
  isAuthenticated: boolean;
  /** `true` while the initial auth state is being restored from storage. */
  isLoading: boolean;
  /**
   * Stores authentication tokens and user data, then updates the context state.
   * @param tokens - The access and refresh tokens received from the API.
   * @param user   - The authenticated user object.
   */
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  /**
   * Clears all stored tokens and user data, resetting the context to unauthenticated.
   */
  logout: () => void;
  /**
   * Merges `updatedFields` into the current user and persists the change
   * to `localStorage`.  Used after profile edits so the UI reflects the
   * new data without requiring a full re-login.
   * @param updatedFields - Partial `User` fields to merge.
   */
  updateUser: (updatedFields: Partial<User>) => void;
}

/** The React context object. Use `useAuth()` to consume it in components. */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication context provider.
 *
 * Wrap the application root (or at least all routes that require auth
 * state) with this provider.
 *
 * @param children - The React subtree that can access the auth context.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore auth state from localStorage on first render.
  // isLoading stays true until this completes so protected routes
  // do not flash the login page before state is ready.
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = tokenService.getAccessToken();
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
          // Valid access token and user data found — restore the session
          setUser(JSON.parse(storedUser));
          if (!localStorage.getItem('sessionStartTime')) {
            localStorage.setItem('sessionStartTime', Date.now().toString());
          }
        } else if (!token) {
          // No access token — remove stale user data if any
          localStorage.removeItem('user');
        }
      } catch (err) {
        // Corrupted storage (e.g. invalid JSON) — clear everything and start fresh
        tokenService.clearTokens();
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // Listen for global unauthorized events (e.g., token refresh failure)
  // to clear states and force user back to the login page.
  useEffect(() => {
    const handleUnauthorized = () => {
      tokenService.clearTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('sessionStartTime');
      setUser(null);
      notify.error('Your session has expired or is invalid. Please sign in again.');
      window.alert('Your session has expired or is invalid. Please sign in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Persists tokens and user data after a successful login response,
   * then updates the context state so the UI reflects the authenticated user.
   */
  const login = (tokens: { accessToken: string; refreshToken: string }, userData: User) => {
    tokenService.setAccessToken(tokens.accessToken);
    tokenService.setRefreshToken(tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('sessionStartTime', Date.now().toString());
    setUser(userData);
  };

  /**
   * Clears all stored authentication state and shows a logout notification.
   * Navigation to the login page is the responsibility of the caller.
   */
  const logout = () => {
    tokenService.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('sessionStartTime');
    setUser(null);
    notify.info('You have successfully logged out.');
    window.alert('You have successfully logged out.');
  };

  /**
   * Applies a partial update to the current user object and writes the
   * merged result back to `localStorage` so it survives a page refresh.
   */
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
