import { describe, it, expect } from 'vitest';
import { rbac } from '../../packages/identity/Roles';

describe('ROLE_PERMISSIONS', () => {
  it('grants admin full access', () => {
    expect(rbac.hasPermission('admin', 'admin:write')).toBe(true);
    expect(rbac.hasPermission('admin', 'commons:read')).toBe(true);
  });

  it('restricts guest to read-only commons', () => {
    expect(rbac.hasPermission('guest', 'commons:read')).toBe(true);
    expect(rbac.hasPermission('guest', 'commons:write')).toBe(false);
  });
});
