import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getGreeting } from '../greeting';

describe('getGreeting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Good Morning between 5 AM and 11:59 AM', () => {
    vi.setSystemTime(new Date(2023, 1, 1, 9, 0, 0)); // 9 AM
    expect(getGreeting('Karan')).toBe('Good Morning, Karan');
    
    vi.setSystemTime(new Date(2023, 1, 1, 5, 0, 0)); // 5 AM
    expect(getGreeting('Karan')).toBe('Good Morning, Karan');
  });

  it('returns Good Afternoon between 12 PM and 4:59 PM', () => {
    vi.setSystemTime(new Date(2023, 1, 1, 14, 0, 0)); // 2 PM
    expect(getGreeting('Karan')).toBe('Good Afternoon, Karan');
    
    vi.setSystemTime(new Date(2023, 1, 1, 12, 0, 0)); // 12 PM
    expect(getGreeting('Karan')).toBe('Good Afternoon, Karan');
  });

  it('returns Good Evening after 5 PM and before 5 AM', () => {
    vi.setSystemTime(new Date(2023, 1, 1, 19, 0, 0)); // 7 PM
    expect(getGreeting('Karan')).toBe('Good Evening, Karan');

    vi.setSystemTime(new Date(2023, 1, 1, 3, 0, 0)); // 3 AM
    expect(getGreeting('Karan')).toBe('Good Evening, Karan');
  });

  it('returns greeting without name if name is not provided', () => {
    vi.setSystemTime(new Date(2023, 1, 1, 9, 0, 0)); // 9 AM
    expect(getGreeting()).toBe('Good Morning');
  });
});
