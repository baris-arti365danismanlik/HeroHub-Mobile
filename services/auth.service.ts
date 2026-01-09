import { authHttpClient, apiHttpClient } from './http.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User } from '@/types/backend';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Login attempt with:', credentials.userName);

      const response = await authHttpClient.post<LoginResponse>('/auth/login', credentials, false);

      const isSuccess = response.success || response.succeeded;

      if (isSuccess && response.data) {
        await tokenStorage.setToken(response.data.token);
        await tokenStorage.setRefreshToken(response.data.refreshToken);
        console.log('Login successful, token saved');
        return response.data;
      }

      throw new Error(response.message || response.friendlyMessage || 'Login failed');
    } catch (error: any) {
      console.error('Login Error:', error);
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
