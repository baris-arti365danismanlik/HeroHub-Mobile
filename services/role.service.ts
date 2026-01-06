import { supabase } from './api.client';
import {
  Role,
  Module,
  RoleAuthorizationModule,
  UserProfile,
  ModulePermissions,
} from '@/types/backend';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getModules(): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getRoleAuthorizations(roleId: string): Promise<RoleAuthorizationModule[]> {
    const { data, error } = await supabase
      .from('role_authorization_modules')
      .select('*')
      .eq('role_id', roleId);

    if (error) throw error;
    return data || [];
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getUserPermissions(
    userId: string
  ): Promise<Record<string, ModulePermissions>> {
    const profile = await this.getUserProfile(userId);

    if (!profile?.role_id) {
      return {};
    }

    const { data: authorizations, error } = await supabase
      .from('role_authorization_modules')
      .select(`
        *,
        module:modules(name)
      `)
      .eq('role_id', profile.role_id);

    if (error) throw error;

    const permissions: Record<string, ModulePermissions> = {};

    authorizations?.forEach((auth: any) => {
      if (auth.module?.name) {
        permissions[auth.module.name] = {
          can_read: auth.can_read,
          can_write: auth.can_write,
          can_delete: auth.can_delete,
        };
      }
    });

    return permissions;
  },

  async hasPermission(
    userId: string,
    moduleName: string,
    permission: 'read' | 'write' | 'delete'
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
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
  },
};
