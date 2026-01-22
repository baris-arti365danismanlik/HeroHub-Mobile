import { authHttpClient, apiHttpClient } from './http.client';
import { tokenStorage } from './api.config';
import type { LoginRequest, LoginResponse, User } from '@/types/backend';
import { normalizePhotoUrl } from '@/utils/formatters';

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
          profilePictureUrl: normalizePhotoUrl(response.data.profilePhoto) || undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
          backend_user_id: response.data.id,
          organization_id: response.data.organizationId,
          role: response.data.role,
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

      let userData = await tokenStorage.getUserData();

      if (userData && !userData.role && token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          let jsonPayload;

          if (typeof atob !== 'undefined') {
            jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
          } else {
            const decoded = Buffer.from(base64, 'base64').toString('utf-8');
            jsonPayload = decoded;
          }

          const payload = JSON.parse(jsonPayload);
          const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          if (role) {
            userData = { ...userData, role };
            await tokenStorage.setUserData(userData);
          }
        } catch (parseError) {
        }
      }

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
