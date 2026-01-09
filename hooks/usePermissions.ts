import { useAuth } from '@/contexts/AuthContext';
import { ModulePermission } from '@/types/backend';

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
    return user?.backend_user_role === '365 Admin' || user?.backend_user_role === 'SuperAdmin';
  };

  return {
    canRead,
    canWrite,
    canDelete,
    hasAnyPermission,
    isAdmin,
  };
}
