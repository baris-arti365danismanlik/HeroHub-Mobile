import { apiClient } from './api.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User, ApiResponse } from '@/types/backend';

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL || 'https://api.herotr.com/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'tr',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const url = `${AUTH_API_URL}/auth/login`;
      console.log('Login Request:', url);
      console.log('Body:', credentials);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      console.log('Login Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data: ApiResponse<LoginResponse> = await response.json();

      if (data.success && data.data) {
        await tokenStorage.setToken(data.data.token);
        await tokenStorage.setRefreshToken(data.data.refreshToken);
        return data.data;
      }

      throw new Error(data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login Error:', error);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      }

      if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
        throw new Error('Network error - Cannot connect to server. Please check your internet connection.');
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
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
