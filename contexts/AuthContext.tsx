import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import type { User, LoginRequest } from '@/types/backend';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
          if (currentUser.backend_user_id && !currentUser.modulePermissions) {
            try {
              const profile = await userService.getUserProfile(currentUser.backend_user_id);
              if (profile?.modulePermissions) {
                currentUser.modulePermissions = profile.modulePermissions;
              }
            } catch (error) {
            }
          }
          setUser(currentUser);
        } else {
          await authService.logout();
        }
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      await authService.login(credentials);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser && currentUser.backend_user_id) {
        try {
          const profile = await userService.getUserProfile(currentUser.backend_user_id);
          if (profile?.modulePermissions) {
            currentUser.modulePermissions = profile.modulePermissions;
          }
        } catch (error) {
        }
        setUser(currentUser);
      } else if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
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
