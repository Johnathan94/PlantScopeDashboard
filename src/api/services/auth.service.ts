import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
  plan: string;
  roles: string[];
  user: {
    id: string;
    email: string;
    plan: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  plan: string;
  roles: string[];
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.auth.me);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await apiClient.post(API_ENDPOINTS.auth.refresh, { refreshToken });
    return response.data;
  },
};
