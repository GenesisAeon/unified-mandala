export type Role = string;
export type Permission = string;

export interface RolePermissions {
  [role: string]: Permission[];
}

/**
 * Simple RBAC helper to map roles to permissions and check access.
 */
export class RBAC {
  constructor(private rolePermissions: RolePermissions) {}

  /**
   * Checks whether the given role has the specified permission.
   */
  hasPermission(role: Role, permission: Permission): boolean {
    const perms = this.rolePermissions[role] || [];
    return perms.includes(permission);
  }

  /**
   * Adds permissions to an existing role or creates the role.
   */
  addRole(role: Role, permissions: Permission[]): void {
    const existing = this.rolePermissions[role] || [];
    this.rolePermissions[role] = Array.from(new Set([...existing, ...permissions]));
  }
}
