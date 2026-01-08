import { useAuth } from '@/contexts/AuthContext';
import { ModulePermissions } from '@/types/backend';

export function usePermissions() {
  const { permissions, hasPermission, userProfile } = useAuth();

  const getModulePermissions = (moduleName: string): ModulePermissions => {
    return (
      permissions[moduleName] || {
        can_read: false,
        can_write: false,
        can_delete: false,
      }
    );
  };

  const canRead = (moduleName: string): boolean => {
    return hasPermission(moduleName, 'read');
  };

  const canWrite = (moduleName: string): boolean => {
    return hasPermission(moduleName, 'write');
  };

  const canDelete = (moduleName: string): boolean => {
    return hasPermission(moduleName, 'delete');
  };

  const hasAnyPermission = (moduleName: string): boolean => {
    const perms = getModulePermissions(moduleName);
    return perms.can_read || perms.can_write || perms.can_delete;
  };

  const isAdmin = (): boolean => {
    return userProfile?.role?.name === 'Admin';
  };

  return {
    permissions,
    userProfile,
    getModulePermissions,
    canRead,
    canWrite,
    canDelete,
    hasAnyPermission,
    isAdmin,
  };
}
