import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

describe('App Root Component', () => {
  it('renders successfully without crashing and displays Home Page by default', () => {
    render(<App />);
    expect(screen.getByText(/Find Your Dream Vehicle/i)).toBeInTheDocument();
  });
});
