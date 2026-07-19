/**
 * @file Badge.tsx
 * @description Small inline label component for displaying status or category tags.
 *
 * Renders a rounded pill-shaped element with colour-coded variants.
 * Uses glassmorphism-style backgrounds (translucent fills with borders)
 * that work on both light and dark backgrounds.
 *
 * @example
 * <Badge variant="success">In Stock</Badge>
 * <Badge variant="danger">Out of Stock</Badge>
 */

import React from 'react';

/**
 * Props for the `Badge` component.
 */
export interface BadgeProps {
  /** The text or element to display inside the badge. */
  children: React.ReactNode;
  /**
   * Colour variant that conveys semantic meaning:
   * - `primary` / `success` — Green (positive / available).
   * - `secondary` / `slate`  — Grey (neutral / inactive).
   * - `danger`               — Red (error / unavailable).
   * - `warning`              — Amber (caution).
   * - `indigo`               — Indigo (informational / category tag).
   * - `purple`               — Purple (special tag).
   * - `pink`                 — Pink (special tag).
   * - `stock-high`           — Bright Green.
   * - `stock-medium`         — Bright Yellow.
   * - `stock-low`            — Bright Red.
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'indigo' | 'slate' | 'purple' | 'pink' | 'stock-high' | 'stock-medium' | 'stock-low';
  /**
   * Size variant of the badge:
   * - `sm` — Default small size.
   * - `md` — Medium size.
   * - `lg` — Large size.
   */
  size?: 'sm' | 'md' | 'lg';
  /** Additional Tailwind class names to merge onto the badge element. */
  className?: string;
}

/**
 * Inline badge / label component.
 *
 * Renders as a `<span>` with predefined colour variants.  Suitable for
 * status indicators, category labels, or count badges.
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const baseStyles = 'inline-flex items-center rounded-full font-semibold border';

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variants = {
    primary: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 backdrop-blur-md',
    secondary: 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30 backdrop-blur-md',
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 backdrop-blur-md',
    danger: 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 backdrop-blur-md',
    warning: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 backdrop-blur-md',
    indigo: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 backdrop-blur-md',
    slate: 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30 backdrop-blur-md',
    purple: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30 backdrop-blur-md',
    pink: 'bg-pink-500/10 text-pink-700 border-pink-500/20 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30 backdrop-blur-md',
    'stock-high': 'bg-green-500 text-white border-green-600 dark:bg-green-600 dark:border-green-700 shadow-sm',
    'stock-medium': 'bg-yellow-400 text-yellow-900 border-yellow-500 dark:bg-yellow-500 dark:text-yellow-950 shadow-sm',
    'stock-low': 'bg-red-500 text-white border-red-600 dark:bg-red-600 dark:border-red-700 shadow-sm',
  };

  return <span className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</span>;
};
