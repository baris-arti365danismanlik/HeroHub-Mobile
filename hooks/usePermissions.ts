import { useAuth } from '@/contexts/AuthContext';
import { ModulePermission } from '@/types/backend';

export function usePermissions() {
  const { modulePermissions, hasModulePermission, userProfile } = useAuth();

  const getModulePermissions = (moduleId: number): ModulePermission | null => {
    return modulePermissions.find((p) => p.moduleId === moduleId) || null;
  };

  const canRead = (moduleId: number): boolean => {
    return hasModulePermission(moduleId, 'read');
  };

  const canWrite = (moduleId: number): boolean => {
    return hasModulePermission(moduleId, 'write');
  };

  const canDelete = (moduleId: number): boolean => {
    return hasModulePermission(moduleId, 'delete');
  };

  const hasAnyPermission = (moduleId: number): boolean => {
    const perms = getModulePermissions(moduleId);
    if (!perms) return false;
    return perms.canRead || perms.canWrite || perms.canDelete;
  };

  return {
    modulePermissions,
    userProfile,
    getModulePermissions,
    canRead,
    canWrite,
    canDelete,
    hasAnyPermission,
    hasModulePermission,
  };
}
