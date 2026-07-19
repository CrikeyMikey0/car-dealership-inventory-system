/**
 * @file Spinner.tsx
 * @description Animated loading spinner SVG component.
 *
 * Renders a circular SVG spinner with an indigo colour and a CSS
 * `animate-spin` rotation animation.  Used by `LoadingScreen` and can be
 * embedded in any context where an inline loading indicator is needed.
 *
 * @example
 * <Spinner size="lg" />
 * <Spinner className="h-8 w-8 text-white" />
 */

import React from 'react';


export interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  const finalClassName = className || sizeClasses[size];

  return (
    <svg
      data-testid="spinner-element"
      className={`animate-spin text-indigo-500 ${finalClassName}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

