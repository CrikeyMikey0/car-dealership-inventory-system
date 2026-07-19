/**
 * @file PublicRoute.tsx
 * @description Route guard that redirects authenticated users away from public-only pages.
 *
 * Renders `children` only when the user is NOT authenticated.  If the user
 * is already logged in, they are redirected to `/dashboard`.
 *
 * This prevents authenticated users from seeing the Login or Register pages,
 * which would be a confusing experience.
 *
 * While auth state is loading (restoring from `localStorage`), a full-screen
 * spinner is shown to prevent a flash of the login form before the redirect occurs.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Route guard for pages that should only be accessible to unauthenticated users
 * (e.g. Login, Register).
 *
 * @param props.children - The page content to render if the user is NOT authenticated.
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while auth state is being restored from storage
  // to avoid a flash of the login form before the redirect occurs.
  if (isLoading) {
    return (
      <div data-testid="loading-screen" className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Already authenticated — send to the dashboard instead
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
