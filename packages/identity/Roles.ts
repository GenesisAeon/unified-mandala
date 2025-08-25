import { RBAC, RolePermissions } from './RBAC';

export type RoleName = 'admin' | 'member' | 'guest';

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  admin: ['admin:read', 'admin:write', 'commons:read', 'commons:write'],
  member: ['commons:read', 'commons:write'],
  guest: ['commons:read'],
};

/**
 * Shared RBAC instance using the default role permissions.
 */
export const rbac = new RBAC(ROLE_PERMISSIONS as RolePermissions);

export type PermissionName = (typeof ROLE_PERMISSIONS)[RoleName][number];
