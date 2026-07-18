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
      expect(screen.getByText(/Find Your Dream Vehicle/i)).toBeInTheDocument();
    });
  });
});
