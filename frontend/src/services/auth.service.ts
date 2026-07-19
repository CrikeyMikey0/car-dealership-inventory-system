/**
 * @file auth.service.ts
 * @description Frontend HTTP service for authentication API calls.
 *
 * Wraps the authentication-related API endpoints exposed by the backend.
 * All methods use the shared `apiClient` Axios instance which handles
 * automatic token attachment and refresh.
 */

import apiClient from '../api/apiClient';
import { LoginPayload, RegisterPayload, AuthResponseData, User } from '../types';

/**
 * Authentication service object that groups all auth-related API calls.
 */
export const authService = {
  /**
   * Authenticates a user with email and password.
   *
   * @param payload - Object containing `email` and `password`.
   * @returns A promise resolving to `AuthResponseData` which includes
   *          `accessToken`, `refreshToken`, and the authenticated `user`.
   */
  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const response = await apiClient.post<{ success: boolean; data: AuthResponseData }>('/auth/login', payload);
    return response.data.data;
  },

  /**
   * Registers a new user account.
   *
   * @param payload - Object containing `name`, `email`, and `password`.
   * @returns A promise resolving to the newly created `User` object (without the password hash).
   */
  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await apiClient.post<{ success: boolean; data: User }>('/auth/register', payload);
    return response.data.data;
  },

  /**
   * Exchanges a refresh token for a new access token.
   *
   * @param refreshToken - The current refresh token string.
   * @returns A promise resolving to an object containing the new `accessToken`.
   */
  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};
