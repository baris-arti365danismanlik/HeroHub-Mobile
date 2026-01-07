import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { roleService } from '@/services/role.service';
import { supabase } from '@/services/api.client';
import type { User, LoginRequest, UserProfile, ModulePermissions } from '@/types/backend';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  permissions: Record<string, ModulePermissions>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (moduleName: string, permission: 'read' | 'write' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Record<string, ModulePermissions>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      if (supabaseUser) {
        const profile = await roleService.getUserProfile(supabaseUser.id);
        const perms = await roleService.getUserPermissions(supabaseUser.id);

        setUserProfile(profile);
        setPermissions(perms);

        setUser((prevUser) => {
          if (prevUser && profile) {
            return {
              ...prevUser,
              role: profile.role?.name,
              position: profile.position,
            };
          }
          return prevUser;
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, backend_user_id')
          .eq('id', session.user.id)
          .maybeSingle();

        const userData: User = {
          id: session.user.id,
          firstName: profile?.full_name?.split(' ')[0] || '',
          lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
          email: session.user.email || '',
          isActive: true,
          createdAt: session.user.created_at,
        };
        setUser(userData);
        await loadUserProfile(userData.id);
      } else {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            await loadUserProfile(currentUser.id);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      let supabaseUserId: string;

      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: response.email,
          password: credentials.password,
        });

        if (signInError || !signInData.user) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: response.email,
            password: credentials.password,
            options: {
              data: {
                full_name: `${response.firstName} ${response.lastName}`,
                backend_user_id: response.id.toString(),
              },
            },
          });

          if (signUpError || !signUpData.user) {
            throw new Error('Supabase authentication failed');
          }

          supabaseUserId = signUpData.user.id;
        } else {
          supabaseUserId = signInData.user.id;
        }
      } catch (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        throw new Error('Failed to authenticate with database');
      }

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', supabaseUserId)
        .maybeSingle();

      if (!existingProfile) {
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Çalışan')
          .maybeSingle();

        await supabase.from('user_profiles').insert({
          id: supabaseUserId,
          role_id: roleData?.id || null,
          full_name: `${response.firstName} ${response.lastName}`,
          backend_user_id: response.id.toString(),
        });
      } else {
        await supabase
          .from('user_profiles')
          .update({ backend_user_id: response.id.toString() })
          .eq('id', supabaseUserId);
      }

      const userData: User = {
        id: supabaseUserId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      await loadUserProfile(userData.id);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setPermissions({});
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const hasPermission = (moduleName: string, permission: 'read' | 'write' | 'delete'): boolean => {
    const modulePermissions = permissions[moduleName];
    if (!modulePermissions) return false;

    switch (permission) {
      case 'read':
        return modulePermissions.can_read;
      case 'write':
        return modulePermissions.can_write;
      case 'delete':
        return modulePermissions.can_delete;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        permissions,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
