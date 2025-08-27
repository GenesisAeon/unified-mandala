export interface ServiceProbe {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
  lastChecked?: string;
  latencyMs?: number;
}

/**
 * TopologyIndex tracks registered services and their health status.
 */
export class TopologyIndex {
  private probes: Map<string, ServiceProbe> = new Map();

  /** Register a service probe. Existing entries are overwritten. */
  register(probe: ServiceProbe): void {
    this.probes.set(probe.name, {
      ...probe,
      lastChecked: probe.lastChecked ?? new Date().toISOString(),
    });
  }

  /** Update the status and optional latency of a probe. */
  updateStatus(name: string, status: ServiceProbe['status'], latencyMs?: number): void {
    const current = this.probes.get(name);
    if (!current) return;
    current.status = status;
    if (latencyMs !== undefined) {
      current.latencyMs = latencyMs;
    }
    current.lastChecked = new Date().toISOString();
    this.probes.set(name, current);
  }

  /** Retrieve a probe by name. */
  get(name: string): ServiceProbe | undefined {
    return this.probes.get(name);
  }

  /** List all registered probes. */
  list(): ServiceProbe[] {
    return Array.from(this.probes.values());
  }

  /** Remove a probe from the index. */
  remove(name: string): void {
    this.probes.delete(name);
  }
}
