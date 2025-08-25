export interface CapabilityRequest {
  capability: string;
  granted: boolean;
  timestamp: number;
}

/**
 * CapabilityGuard maintains a simple in-memory consent cache.
 * It can be extended with persistent storage or more
 * sophisticated policy enforcement.
 */
export class CapabilityGuard {
  private cache = new Map<string, CapabilityRequest>();

  /**
   * Record consent for a capability.
   */
  request(capability: string, granted: boolean) {
    this.cache.set(capability, {
      capability,
      granted,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if consent exists for the given capability.
   */
  hasConsent(capability: string): boolean {
    const entry = this.cache.get(capability);
    return !!entry && entry.granted;
  }

  /**
   * Ensure consent before proceeding, otherwise throw an error.
   */
  enforce(capability: string) {
    if (!this.hasConsent(capability)) {
      throw new Error(`Capability "${capability}" requires consent`);
    }
  }
}
