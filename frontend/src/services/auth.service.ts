import apiClient from '../api/apiClient';
import { LoginPayload, RegisterPayload, AuthResponseData, User } from '../types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const response = await apiClient.post<{ success: boolean; data: AuthResponseData }>('/auth/login', payload);
    return response.data.data;
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await apiClient.post<{ success: boolean; data: User }>('/auth/register', payload);
    return response.data.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};
