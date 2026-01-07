import {
  Role,
  Module,
  RoleAuthorizationModule,
  UserProfile,
  ModulePermissions,
} from '@/types/backend';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    return [];
  },

  async getModules(): Promise<Module[]> {
    return [];
  },

  async getRoleAuthorizations(roleId: string): Promise<RoleAuthorizationModule[]> {
    return [];
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return null;
  },

  async getUserPermissions(
    userId: string
  ): Promise<Record<string, ModulePermissions>> {
    return {};
  },

  async hasPermission(
    userId: string,
    moduleName: string,
    permission: 'read' | 'write' | 'delete'
  ): Promise<boolean> {
    return false;
  },
};
