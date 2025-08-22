export type TenantID = string;
export type InstanceID = string;

/**
 * Represents a tenant within the Mandala network.
 */
export interface Tenant {
  id: TenantID;
  name: string;
}

/**
 * Represents an instance that belongs to a tenant.
 */
export interface Instance {
  id: InstanceID;
  tenantId: TenantID;
  name: string;
}

/**
 * Maps a user role to a tenant or optional instance.
 */
export interface Membership {
  tenantId: TenantID;
  instanceId?: InstanceID;
  role: string;
}
