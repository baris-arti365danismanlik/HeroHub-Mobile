import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { homeService } from '@/services/home.service';
import type { User, LoginRequest, UserProfileDetails, ModulePermission } from '@/types/backend';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileDetails | null;
  modulePermissions: ModulePermission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasModulePermission: (moduleId: number, permission: 'read' | 'write' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDetails | null>(null);
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserProfile();
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await homeService.getUserInformation();
      setUserProfile(profile);
      setModulePermissions(profile.modulePermissions || []);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      const userData: User = {
        id: response.id.toString(),
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        backend_user_id: response.id,
        organization_id: response.organizationId,
      };

      setUser(userData);
      await loadUserProfile();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserProfile(null);
      setModulePermissions([]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const hasModulePermission = (
    moduleId: number,
    permission: 'read' | 'write' | 'delete'
  ): boolean => {
    const modulePermission = modulePermissions.find((p) => p.moduleId === moduleId);
    if (!modulePermission) return false;

    switch (permission) {
      case 'read':
        return modulePermission.canRead;
      case 'write':
        return modulePermission.canWrite;
      case 'delete':
        return modulePermission.canDelete;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        modulePermissions,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasModulePermission,
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
