import { describe, it, expect, beforeEach } from 'vitest';
import { tokenService } from '../token.service.ts';

describe('TokenService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store, retrieve, and remove access token', () => {
    expect(tokenService.getAccessToken()).toBeNull();
    
    tokenService.setAccessToken('access-test-token');
    expect(tokenService.getAccessToken()).toBe('access-test-token');
    expect(localStorage.getItem('access_token')).toBe('access-test-token');

    tokenService.removeAccessToken();
    expect(tokenService.getAccessToken()).toBeNull();
  });

  it('should store, retrieve, and remove refresh token', () => {
    expect(tokenService.getRefreshToken()).toBeNull();
    
    tokenService.setRefreshToken('refresh-test-token');
    expect(tokenService.getRefreshToken()).toBe('refresh-test-token');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-test-token');

    tokenService.removeRefreshToken();
    expect(tokenService.getRefreshToken()).toBeNull();
  });

  it('should clear all tokens', () => {
    tokenService.setAccessToken('access');
    tokenService.setRefreshToken('refresh');

    tokenService.clearTokens();
    expect(tokenService.getAccessToken()).toBeNull();
    expect(tokenService.getRefreshToken()).toBeNull();
  });
});
