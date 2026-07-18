import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../format';

describe('formatCurrency', () => {
  it('formats positive numbers correctly with INR symbol and en-IN locale', () => {
    expect(formatCurrency(1000)).toBe('₹1,000');
    expect(formatCurrency(100000)).toBe('₹1,00,000');
    expect(formatCurrency(10000000)).toBe('₹1,00,00,000');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-50000)).toBe('₹-50,000');
  });
});
