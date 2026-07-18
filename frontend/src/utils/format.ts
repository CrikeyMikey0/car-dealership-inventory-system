/**
 * Formats a given numeric value into Indian Rupees (INR)
 * @param value The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`;
};
