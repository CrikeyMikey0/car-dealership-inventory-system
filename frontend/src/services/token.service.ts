/**
 * @file token.service.ts
 * @description localStorage-based token storage service.
 *
 * Provides a centralised, named interface for reading, writing, and clearing
 * the JWT access and refresh tokens stored in `localStorage`.  Using named
 * constants for the storage keys prevents typos across the codebase and makes
 * key changes trivial.
 *
 * Note: `localStorage` is synchronous and survives page refreshes but is
 * scoped to the origin.  For higher-security applications, consider using
 * `sessionStorage` or `HttpOnly` cookies instead.
 */

/** Storage key for the JWT access token. */
const ACCESS_TOKEN_KEY = 'access_token';
/** Storage key for the JWT refresh token. */
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Service object that abstracts all JWT token persistence operations.
 */
export const tokenService = {
  /**
   * Retrieves the stored access token.
   * @returns The access token string, or `null` if not stored.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Persists the access token to storage.
   * @param token - The JWT access token string to store.
   */
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Removes the access token from storage.
   */
  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Retrieves the stored refresh token.
   * @returns The refresh token string, or `null` if not stored.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Persists the refresh token to storage.
   * @param token - The JWT refresh token string to store.
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Removes the refresh token from storage.
   */
  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Removes both the access and refresh tokens from storage.
   * Called on logout or when token refresh fails.
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
