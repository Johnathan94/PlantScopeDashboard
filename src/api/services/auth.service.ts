import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    subscriptionTier: string;
    createdAt: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  subscriptionTier: string;
  weeklyIdentificationLimit: number;
  identificationsUsedThisWeek: number;
  plantLimit: number;
  plantsOwned: number;
  createdAt: string;
  lastLoginAt?: string;
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
