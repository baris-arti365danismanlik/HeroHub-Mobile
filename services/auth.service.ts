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

      if (response.succeeded && response.data) {
        return response.data;
      }

      return null;
    } catch (error: any) {
      const status = error.status;
      const is401 = status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized');
      const is400 = status === 400 || error.message?.includes('400');

      if (is401 || is400) {
        await tokenStorage.clearTokens();
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
