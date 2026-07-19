/**
 * @file LoadingScreen.tsx
 * @description Full-screen loading overlay component.
 *
 * Renders a fixed, backdrop-blurred overlay with an animated spinner and
 * an optional status message.  Used for full-page loading states such as
 * initial data fetching or async page transitions.
 *
 * The root `<div>` has `data-testid="loading-screen"` for test targeting.
 *
 * @example
 * {isLoading && <LoadingScreen message="Fetching vehicles..." />}
 */

import React from 'react';

import { Spinner } from './Spinner';

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div
      data-testid="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-4"
    >
      <Spinner className="h-10 w-10" />
      {message && <p className="text-sm font-semibold text-slate-300">{message}</p>}
    </div>
  );
};
