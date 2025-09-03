/**
 * Describes a Mandala peer in the global federation registry.
 * Each peer exposes a manifest so other instances can
 * discover available capabilities and contact information.
 */
export interface FederationManifest {
  /** Unique identifier for the peer, e.g. a UUID or hash. */
  id: string;
  /** Human readable label for the peer. */
  name: string;
  /** Base URL where the peer can be reached. */
  url: string;
  /** Public key used for signed messages. */
  publicKey: string;
  /** List of capabilities that this peer provides. */
  capabilities: string[];
  /** Optional geographic or logical region description. */
  region?: string;
  /** Timestamp in ISO format when manifest was created. */
  createdAt: string;
  /** Timestamp in ISO format when manifest was last updated. */
  updatedAt?: string;
}

/**
 * Type guard to ensure an arbitrary object is a FederationManifest.
 */
export function isFederationManifest(value: unknown): value is FederationManifest {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.url === 'string' &&
    typeof m.publicKey === 'string' &&
    Array.isArray(m.capabilities) &&
    m.capabilities.every((c) => typeof c === 'string') &&
    typeof m.createdAt === 'string'
  );
}
