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
        console.log('No token found, skipping getCurrentUser');
        return null;
      }

      console.log('Fetching current user with token:', token.substring(0, 20) + '...');
      const response = await apiHttpClient.get<User>('/User/current');

      if (response.data) {
        console.log('Current user fetched successfully:', response.data.email);
        return response.data;
      }

      console.warn('No user data in response');
      return null;
    } catch (error: any) {
      console.error('Error getting current user:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });

      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.log('Clearing tokens due to unauthorized error');
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
