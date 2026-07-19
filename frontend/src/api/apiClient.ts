/**
 * @file apiClient.ts
 * @description Axios HTTP client configured for the KATA API.
 *
 * Provides a pre-configured Axios instance with:
 *  - A `baseURL` of `/api` so all service calls are relative paths.
 *  - A request interceptor that automatically attaches the stored JWT
 *    access token as a `Authorization: Bearer <token>` header.
 *  - A response interceptor that handles token refresh on 401 responses
 *    using a queue-based approach to serialise concurrent refresh requests.
 *
 * Token Refresh Flow:
 *  1. A request returns HTTP 401.
 *  2. If a refresh is not already in progress, the interceptor:
 *     a. Reads the stored refresh token from `tokenService`.
 *     b. Posts to `/api/auth/refresh` to obtain a new access token.
 *     c. Stores the new access token and retries the original request.
 *  3. Concurrent 401 responses are queued — they wait for the refresh to
 *     complete and then replay with the new token.
 *  4. If the refresh itself fails (expired or invalid), all queued requests
 *     are rejected, tokens are cleared, and an `auth:unauthorized` event
 *     is dispatched so the UI can redirect to the login page.
 */

import axios from 'axios';
import { tokenService } from '../services/token.service';

const API_URL = (import.meta.env.VITE_API_URL || '/api').trim();
console.log('[KATA apiClient] API_URL resolved to:', API_URL);

/**
 * Shared Axios instance for all API calls.
 * Imported and used by service modules instead of calling `axios` directly.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────

// Attach the stored JWT access token to every outgoing request.
// Runs silently if no token is stored (public endpoints).
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor — Automatic Token Refresh ─────────────────────────

/**
 * Whether a token refresh request is currently in flight.
 * Prevents multiple simultaneous refresh calls when several requests
 * return 401 at the same time.
 */
let isRefreshing = false;

/**
 * Queue of resolve/reject callbacks for requests that arrived while a
 * refresh was already in progress.  Replayed once the refresh resolves.
 */
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

/**
 * Drains the failed request queue after a token refresh attempt.
 *
 * @param error - Non-null if the refresh failed; resolves each queued
 *                promise with the error.
 * @param token - The new access token if the refresh succeeded; `null` on failure.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  // Pass successful responses through unchanged
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt a token refresh only for 401 responses that are:
    //  - Not already retried (prevents infinite retry loops)
    //  - Not from the refresh or login endpoints themselves
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
      if (isRefreshing) {
        // A refresh is already underway — queue this request to be replayed
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        // No refresh token stored — user must log in again
        tokenService.clearTokens();
        window.dispatchEvent(new Event('auth:unauthorized'));
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Exchange the refresh token for a new access token
        const refreshUrl = API_URL.endsWith('/api') 
          ? `${API_URL}/auth/refresh` 
          : `${API_URL}/api/auth/refresh`;
        const response = await axios.post(refreshUrl, { refreshToken });
        const { accessToken } = response.data.data;
        
        // Persist the new access token and update default headers
        tokenService.setAccessToken(accessToken);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        
        // Notify all queued requests of the new token and replay the original
        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear all tokens and force re-authentication
        processQueue(refreshError, null);
        tokenService.clearTokens();
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
