/**
 * @file Button.tsx
 * @description Reusable, accessible button component with multiple variants and states.
 *
 * Supports four visual variants, three sizes, a loading state with an inline
 * spinner, and a full-width mode.  All native `<button>` attributes are
 * forwarded via spread props.
 *
 * @example
 * <Button variant="primary" size="md" isLoading={isSubmitting}>Submit</Button>
 * <Button variant="danger" onClick={handleDelete}>Delete</Button>
 */

import React from 'react';

/**
 * Props for the `Button` component.
 * Extends all native `<button>` HTML attributes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant.
   * - `primary`   — Indigo fill (default call-to-action style).
   * - `secondary` — Slate fill (secondary actions).
   * - `danger`    — Rose fill (destructive actions).
   * - `outline`   — Transparent with border (tertiary/ghost style).
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  /**
   * Controls the padding and font size.
   * - `sm` — Compact (e.g. table actions).
   * - `md` — Standard (default).
   * - `lg` — Large (prominent CTAs).
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * When `true`, disables the button and replaces children with an animated
   * spinner and the text "Loading..." to communicate async activity.
   */
  isLoading?: boolean;
  /** When `true`, the button stretches to fill its container's full width. */
  fullWidth?: boolean;
}

/**
 * Reusable button component.
 *
 * The button is automatically disabled while `isLoading` is `true` or when
 * the native `disabled` prop is set.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  // Base styles shared by all variants
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 focus:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        // Loading state: inline spinner with "Loading..." text
        <span data-testid="spinner" className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
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
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
