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

        const userData: User = {
          id: response.data.id.toString(),
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          profilePictureUrl: response.data.profilePhoto,
          isActive: true,
          createdAt: new Date().toISOString(),
          backend_user_id: response.data.id,
          organization_id: response.data.organizationId,
        };

        await tokenStorage.setUserData(userData);
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

      const userData = await tokenStorage.getUserData();
      return userData;
    } catch (error: any) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
