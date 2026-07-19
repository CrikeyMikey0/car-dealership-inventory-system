/**
 * @file ErrorMessage.tsx
 * @description Inline error message banner component.
 *
 * Displays a rose-coloured alert banner with a warning emoji icon and a text
 * message.  Used throughout the application to surface API errors, form
 * submission failures, and other user-facing error states.
 *
 * @example
 * {error && <ErrorMessage message={error} />}
 */

import React from 'react';


export interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-sm max-w-md mx-auto ${className}`}>
      <span className="text-lg">⚠️</span>
      <p className="font-medium">{message}</p>
    </div>
  );
};
