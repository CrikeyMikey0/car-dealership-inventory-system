/**
 * @file Input.tsx
 * @description Accessible text input component with optional label and error display.
 *
 * Wraps a native `<input>` element with:
 *  - An auto-linked `<label>` (derived from the `label` prop if no `id` is supplied).
 *  - Dark-themed styling consistent with the rest of the design system.
 *  - A red error state (border + ring) and an inline error message when `error` is set.
 *  - A `forwardRef` so parent components can hold a ref to the underlying input.
 *
 * All native `<input>` attributes (type, placeholder, value, onChange, etc.) are
 * forwarded via spread props.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" error={errors.email} />
 */

import React, { forwardRef } from 'react';

/**
 * Props for the `Input` component.
 * Extends all native `<input>` HTML attributes.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text displayed in the `<label>` element above the input. */
  label?: string;
  /** Validation error message displayed below the input in red. */
  error?: string;
}

/**
 * Styled text input component with label and error message support.
 *
 * Uses `forwardRef` so the underlying `<input>` DOM node is accessible to
 * parent components that need to manage focus or integrate with form libraries.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    // Derive a stable ID from the label text if no explicit ID is provided,
    // ensuring the <label> htmlFor attribute correctly links to the input.
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-400">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-3 py-2 text-sm bg-slate-900 border ${
            error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:ring-indigo-500'
          } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${className}`}
          {...props}
        />
        {/* Display validation error message below the input */}
        {error && <span className="text-xs font-medium text-rose-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
