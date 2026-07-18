import React from 'react';

export interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-sm max-w-md mx-auto">
      <span className="text-lg">⚠️</span>
      <p className="font-medium">{message}</p>
    </div>
  );
};
