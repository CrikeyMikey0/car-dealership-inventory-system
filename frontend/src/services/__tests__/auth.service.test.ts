import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth.service';
import apiClient from '../../api/apiClient';

vi.mock('../../api/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login calls POST /api/auth/login and returns response data', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-123',
          user: { id: 'u1', name: 'Admin', email: 'admin@dealership.com', role: 'ADMIN' },
        },
      },
    };
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.login({ email: 'admin@dealership.com', password: 'AdminPassword123!' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@dealership.com',
      password: 'AdminPassword123!',
    });
    expect(result).toEqual(mockResponse.data.data);
  });

  it('register calls POST /api/auth/register and returns user data', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'USER' },
      },
    };
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'UserPassword123!',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'UserPassword123!',
    });
    expect(result).toEqual(mockResponse.data.data);
  });
});
