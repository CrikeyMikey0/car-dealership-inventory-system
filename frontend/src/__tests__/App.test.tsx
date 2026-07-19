/**
 * @file App.test.tsx
 * @description Unit tests for the root App component.
 *
 * Verifies that the application renders without crashing and correctly handles
 * initial routing and lazy-loading states (e.g., displaying a loading fallback
 * before the home page is ready).
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

describe('App Root Component (Route Splitting)', () => {
  it('displays loading fallback initially, then renders Home', async () => {
    render(<App />);
    
    // Check if loading fallback is displayed first
    expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
    
    // Then wait for home page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Find Your Dream Vehicle/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
