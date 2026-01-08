import { authHttpClient, apiHttpClient } from './http.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User } from '@/types/backend';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authHttpClient.post<LoginResponse>('/auth/login', credentials, false);

      const isSuccess = response.success || response.succeeded;

      if (isSuccess && response.data) {
        await tokenStorage.setToken(response.data.token);
        await tokenStorage.setRefreshToken(response.data.refreshToken);
        return response.data;
      }

      throw new Error(response.message || response.friendlyMessage || 'Login failed');
    } catch (error: any) {
      throw error;
    }
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

      const response = await apiHttpClient.get<User>('/User/current');
      if (response.data) {
        return response.data;
      }

      await this.logout();
      return null;
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        await this.logout();
      }
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
