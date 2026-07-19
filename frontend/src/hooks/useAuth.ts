/**
 * @file useAuth.ts
 * @description Custom React hook for consuming the authentication context.
 *
 * Provides a convenient, type-safe way to access the `AuthContext` value
 * from any component in the application.  Throws a helpful error when
 * called outside of an `AuthProvider` to aid development-time debugging.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Returns the current authentication context value.
 *
 * @returns `AuthContextType` — includes `user`, `isAuthenticated`, `isLoading`,
 *           `login`, `logout`, and `updateUser`.
 * @throws {Error} If called outside of an `AuthProvider` component tree.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
