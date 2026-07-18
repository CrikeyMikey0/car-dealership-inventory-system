import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Login';
import { Register } from '../Register';
import { authService } from '../../services/auth.service';
import { AuthContext } from '../../contexts/AuthContext';
import { notify } from '../../utils/notification';

vi.mock('../../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('../../utils/notification', () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Authentication Pages & Forms', () => {
  const mockLogin = vi.fn();

  const authContextValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    logout: vi.fn(),
    updateUser: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Page', () => {
    it('renders login form with email and password inputs', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitted empty', async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('submits successfully and navigates on valid credentials', async () => {
      const mockLoginResponse = {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        user: { id: '1', name: 'Admin', email: 'admin@dealership.com', role: 'ADMIN' as const },
      };
      vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse);

      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@dealership.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'AdminPassword123!' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'admin@dealership.com',
          password: 'AdminPassword123!',
        });
        expect(mockLogin).toHaveBeenCalledWith(
          { accessToken: 'access-123', refreshToken: 'refresh-123' },
          mockLoginResponse.user
        );
        expect(notify.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('shows error toast when login API fails', async () => {
      vi.mocked(authService.login).mockRejectedValueOnce({
        response: { data: { message: 'Invalid email or password' } },
      });

      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(notify.error).toHaveBeenCalled();
      });
    });
  });

  describe('Register Page', () => {
    it('renders register form with name, email and password inputs', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Register />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('submits successfully and redirects on registration', async () => {
      const mockRegisteredUser = { id: '2', name: 'John Doe', email: 'john@example.com', role: 'USER' as const };
      vi.mocked(authService.register).mockResolvedValueOnce(mockRegisteredUser);

      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Register />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'UserPassword123!' } });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'UserPassword123!',
        });
        expect(notify.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });
});
