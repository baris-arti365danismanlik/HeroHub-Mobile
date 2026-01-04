import { apiClient } from './api.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User, ApiResponse } from '@/types/backend';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      await tokenStorage.setToken(response.data.token);
      await tokenStorage.setRefreshToken(response.data.refreshToken);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  }

  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await tokenStorage.getToken();
      if (!token) {
        return null;
      }

      const response = await apiClient.get<User>('/User/current');
      return response.data || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
