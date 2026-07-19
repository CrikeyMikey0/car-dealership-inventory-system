/**
 * @file utils/format.ts
 * @description Formatting utility functions.
 *
 * Contains pure helper functions for formatting display values.
 * All functions in this module are stateless and have no side effects.
 */

/**
 * Formats a numeric value as Indian Rupees (INR) using the `en-IN` locale.
 *
 * Prepends the ₹ symbol and applies Indian number formatting conventions
 * (e.g. `1,00,000` for one lakh).
 *
 * @param value - The numeric amount to format (in Rupees).
 * @returns A formatted currency string (e.g. `"₹1,00,000"`).
 *
 * @example
 * formatCurrency(150000); // "₹1,50,000"
 */
export const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`;
};
