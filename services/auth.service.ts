import { supabase } from './api.client';
import type { LoginRequest, LoginResponse, User } from '@/types/backend';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Login attempt with:', credentials.userName);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.userName,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message || 'Giriş başarısız');
      }

      if (!data.user) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, position')
        .eq('id', data.user.id)
        .maybeSingle();

      const names = profile?.full_name?.split(' ') || ['', ''];
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      return {
        id: parseInt(data.user.id.replace(/-/g, '').substring(0, 8), 16),
        email: data.user.email || '',
        token: data.session?.access_token || '',
        tokenExpireTime: new Date(Date.now() + 3600000).toISOString(),
        refreshToken: data.session?.refresh_token || '',
        refreshTokenExpireTime: new Date(Date.now() + 86400000).toISOString(),
        firstName,
        lastName,
        role: 'User',
        profilePhoto: '',
        organizationId: 1,
      };
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, position')
        .eq('id', user.id)
        .maybeSingle();

      const names = profile?.full_name?.split(' ') || ['', ''];

      return {
        id: user.id,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || '',
        isActive: true,
        createdAt: user.created_at,
        position: profile?.position,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
}

export const authService = new AuthService();
