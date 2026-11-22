import { apiClient } from './axios';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  UpdateProfilePayload,
} from '../types/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login/', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register/', payload);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/v1/auth/me/');
    return response.data;
  },

  updateMe: async (payload: UpdateProfilePayload): Promise<User> => {
    const response = await apiClient.patch<User>('/api/v1/auth/me/', payload);
    return response.data;
  },

  logout: async (refreshToken: string | null): Promise<void> => {
    if (refreshToken) {
      await apiClient.post('/api/v1/auth/logout/', { refresh: refreshToken });
    }
  },
};
