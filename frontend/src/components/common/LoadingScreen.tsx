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
