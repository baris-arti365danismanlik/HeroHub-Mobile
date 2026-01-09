import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const canRead = (moduleName: string): boolean => {
    return true;
  };

  const canWrite = (moduleName: string): boolean => {
    return true;
  };

  const canDelete = (moduleName: string): boolean => {
    return true;
  };

  const hasAnyPermission = (moduleName: string): boolean => {
    return true;
  };

  const isAdmin = (): boolean => {
    return true;
  };

  return {
    canRead,
    canWrite,
    canDelete,
    hasAnyPermission,
    isAdmin,
  };
}
