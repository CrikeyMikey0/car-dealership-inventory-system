/**
 * @file Select.tsx
 * @description Accessible select / dropdown component with optional label, error, and data options.
 *
 * Wraps a native `<select>` element with:
 *  - An auto-linked `<label>` (derived from the `label` prop if no `id` is supplied).
 *  - Dark-themed styling consistent with the rest of the design system.
 *  - A red error state (border + ring) and an inline error message when `error` is set.
 *  - A `forwardRef` so parent components can hold a ref to the underlying select.
 *  - An `options` prop for declarative option rendering, or `children` for manual control.
 *
 * @example
 * <Select
 *   label="Category"
 *   options={[{ label: 'Sedan', value: 'sedan' }, { label: 'SUV', value: 'suv' }]}
 *   error={errors.category}
 * />
 */

import React, { forwardRef } from 'react';

/**
 * Represents a single `<option>` entry in the select dropdown.
 */
export interface SelectOption {
  /** Human-readable text displayed in the dropdown. */
  label: string;
  /** Value submitted with the form when this option is selected. */
  value: string;
}

/**
 * Props for the `Select` component.
 * Extends all native `<select>` HTML attributes.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Text displayed in the `<label>` element above the select. */
  label?: string;
  /** Validation error message displayed below the select in red. */
  error?: string;
  /**
   * Declarative list of options.  When provided, renders `<option>` elements
   * automatically.  If omitted, `children` are rendered instead for manual control.
   */
  options?: SelectOption[];
}

/**
 * Styled select dropdown component with label, options, and error message support.
 *
 * Uses `forwardRef` so the underlying `<select>` DOM node is accessible to
 * parent components that integrate with form libraries like React Hook Form.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, ...props }, ref) => {
    // Derive a stable ID from the label text if no explicit ID is provided.
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-400">
            {label}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={`px-3 py-2 text-sm bg-slate-900 border ${
            error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:ring-indigo-500'
          } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${className}`}
          {...props}
        >
          {/* Render from `options` array if provided; fall back to manual `children` */}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {/* Display validation error message below the select */}
        {error && <span className="text-xs font-medium text-rose-400">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
