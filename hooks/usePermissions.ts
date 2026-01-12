import { useAuth } from '@/contexts/AuthContext';
import { ModulePermission } from '@/types/backend';

export const MODULE_IDS = {
  ADMIN: 1,
  PROFILE: 2,
  LEAVE_REQUESTS: 3,
  EMPLOYEES: 4,
  ONBOARDING: 5,
  PDKS: 6,
  ASSETS: 7,
  INBOX: 8,
} as const;

export function usePermissions(modulePermissions?: ModulePermission[]) {
  const { user } = useAuth();

  const getPermission = (moduleId: number): ModulePermission | undefined => {
    return modulePermissions?.find(mp => mp.moduleId === moduleId);
  };

  const canRead = (moduleId: number): boolean => {
    const permission = getPermission(moduleId);
    return permission?.canRead ?? false;
  };

  const canWrite = (moduleId: number): boolean => {
    const permission = getPermission(moduleId);
    return permission?.canWrite ?? false;
  };

  const canDelete = (moduleId: number): boolean => {
    const permission = getPermission(moduleId);
    return permission?.canDelete ?? false;
  };

  const hasAnyPermission = (moduleId: number): boolean => {
    const permission = getPermission(moduleId);
    return (permission?.canRead || permission?.canWrite || permission?.canDelete) ?? false;
  };

  const isAdmin = (): boolean => {
    return user?.role === '365 Admin' || user?.role === 'SuperAdmin';
  };

  return {
    canRead,
    canWrite,
    canDelete,
    hasAnyPermission,
    isAdmin,
  };
}
