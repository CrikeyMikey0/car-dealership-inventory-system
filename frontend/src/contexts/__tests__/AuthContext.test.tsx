import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { AuthProvider } from '../AuthContext.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { tokenService } from '../../services/token.service.ts';

vi.mock('../../services/token.service', () => ({
  tokenService: {
    getAccessToken: vi.fn(),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    clearTokens: vi.fn(),
  },
}));

describe('AuthContext & useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render provider and expose default values', () => {
    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();
      return (
        <div>
          <span data-testid="user">{user ? user.email : 'no-user'}</span>
          <span data-testid="auth">{isAuthenticated.toString()}</span>
          <span data-testid="loading">{isLoading.toString()}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('auth').textContent).toBe('false');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('should restore user session from localStorage if token exists', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('fake-token');
    const mockUser = { id: '1', name: 'Admin User', email: 'admin@dealership.com', role: 'ADMIN' as const };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const TestComponent = () => {
      const { user, isAuthenticated } = useAuth();
      return (
        <div>
          <span data-testid="user">{user?.email}</span>
          <span data-testid="auth">{isAuthenticated.toString()}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('admin@dealership.com');
    expect(screen.getByTestId('auth').textContent).toBe('true');
  });

  it('should allow login and update state & localStorage', () => {
    const TestComponent = () => {
      const { user, isAuthenticated, login } = useAuth();
      return (
        <div>
          <span data-testid="user">{user ? user.email : 'no-user'}</span>
          <span data-testid="auth">{isAuthenticated.toString()}</span>
          <button
            data-testid="login-btn"
            onClick={() =>
              login(
                { accessToken: 'acc', refreshToken: 'ref' },
                { id: '1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' }
              )
            }
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('no-user');
    
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('admin@example.com');
    expect(screen.getByTestId('auth').textContent).toBe('true');
    expect(tokenService.setAccessToken).toHaveBeenCalledWith('acc');
    expect(tokenService.setRefreshToken).toHaveBeenCalledWith('ref');
    expect(localStorage.getItem('user')).toContain('admin@example.com');
  });

  it('should allow logout and clear state & localStorage', () => {
    const TestComponent = () => {
      const { user, logout, login } = useAuth();
      return (
        <div>
          <span data-testid="user">{user ? user.email : 'no-user'}</span>
          <button
            data-testid="login-btn"
            onClick={() =>
              login(
                { accessToken: 'acc', refreshToken: 'ref' },
                { id: '1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' }
              )
            }
          >
            Login
          </button>
          <button data-testid="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('admin@example.com');

    act(() => {
      screen.getByTestId('logout-btn').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('useAuth should throw error outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    
    spy.mockRestore();
  });
});

