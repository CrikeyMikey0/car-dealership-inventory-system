import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../MainLayout.tsx';
import { DashboardLayout } from '../DashboardLayout.tsx';
import { AuthLayout } from '../AuthLayout.tsx';
import { useAuth } from '../../hooks/useAuth.ts';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

describe('Layout Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });
  });

  it('MainLayout renders header, footer, navigation and children for guest', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MainLayout>
          <div data-testid="main-child">Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('main-child')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('MainLayout renders ADMIN specific navigation links', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@dealership.com', role: 'ADMIN' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MainLayout>
          <div>Admin View</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /add vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('DashboardLayout renders sidebar navigation and user identity info', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@dealership.com', role: 'ADMIN' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardLayout>
          <div data-testid="dash-child">Dashboard Content</div>
        </DashboardLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/admin@dealership.com/i)).toBeInTheDocument();
    expect(screen.getByTestId('dash-child')).toBeInTheDocument();
  });

  it('AuthLayout renders centered structure with title and subtitle', () => {
    render(
      <MemoryRouter>
        <AuthLayout title="Welcome Back" subtitle="Please sign in">
          <div data-testid="auth-child">Form Content</div>
        </AuthLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Please sign in')).toBeInTheDocument();
    expect(screen.getByTestId('auth-child')).toBeInTheDocument();
  });
});
