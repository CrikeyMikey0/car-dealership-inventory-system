/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../apiClient.ts';
import { tokenService } from '../../services/token.service.ts';

vi.mock('../../services/token.service', () => ({
  tokenService: {
    getAccessToken: vi.fn(),
  },
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct configuration', () => {
    expect(apiClient.defaults.baseURL).toBe('/api');
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('should add Authorization header if token exists', async () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('mock-token');

    const config = { headers: {} } as any;
    const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled;
    const modifiedConfig = await requestInterceptor(config);

    expect(modifiedConfig.headers['Authorization']).toBe('Bearer mock-token');
  });

  it("should not add Authorization header if token doesn't exist", async () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue(null);

    const config = { headers: {} } as any;
    const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled;
    const modifiedConfig = await requestInterceptor(config);

    expect(modifiedConfig.headers['Authorization']).toBeUndefined();
  });
});
