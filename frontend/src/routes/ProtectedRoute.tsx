/**
 * @file ProtectedRoute.tsx
 * @description Route guard for authenticated (and optionally role-restricted) routes.
 *
 * Renders `children` only when:
 *  1. Authentication state has finished loading (`isLoading === false`).
 *  2. The user is authenticated (`isAuthenticated === true`).
 *  3. The user's role matches `requiredRole` (if one is specified).
 *
 * While loading, a full-screen spinner is shown so there is no flash of the
 * login page before auth state is restored from `localStorage`.
 *
 * On failure:
 *  - Unauthenticated users are redirected to `/login`.
 *  - Authenticated users lacking the required role are redirected to `/403`.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

/**
 * Props for the `ProtectedRoute` component.
 */
interface ProtectedRouteProps {
  /** The page or component to render if all access checks pass. */
  children: React.ReactNode;
  /**
   * Optional role requirement.  If provided, the authenticated user must
   * have this exact role — otherwise they are redirected to `/403 Forbidden`.
   */
  requiredRole?: UserRole;
}

/**
 * Route guard component for protected pages.
 *
 * @param props.children     - The content to render when access is granted.
 * @param props.requiredRole - Optional role required to access this route.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while auth state is being restored from storage
  // to avoid an incorrect redirect before the user object is available.
  if (isLoading) {
    return (
      <div data-testid="loading-screen" className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users that lack the required role to the 403 page
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
