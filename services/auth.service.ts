import { authHttpClient, apiHttpClient } from './http.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User, UserProfileDetails, ModulePermission } from '@/types/backend';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authHttpClient.post<LoginResponse>('/auth/login', credentials, false);

      const isSuccess = response.success || response.succeeded;

      if (isSuccess && response.data) {
        await tokenStorage.setToken(response.data.token);
        await tokenStorage.setRefreshToken(response.data.refreshToken);

        let modulePermissions: ModulePermission[] = [];
        try {
          const profileResponse = await apiHttpClient.get<UserProfileDetails>(
            `/Profile/get-userprofile/${response.data.id}`
          );
          if (profileResponse.data?.modulePermissions) {
            modulePermissions = profileResponse.data.modulePermissions;
          }
        } catch (error) {
        }

        const userData: User = {
          id: response.data.id.toString(),
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          isActive: true,
          createdAt: new Date().toISOString(),
          backend_user_id: response.data.id,
          organization_id: response.data.organizationId,
          modulePermissions,
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
