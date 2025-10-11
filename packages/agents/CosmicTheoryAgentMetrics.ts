export interface MetricEntry {
  timestamp: number;
  type: string;
  value: number;
}

/**
 * Simple in-memory store for CosmicTheoryAgent metrics.
 */
export class CosmicTheoryAgentMetrics {
  private metrics: MetricEntry[] = [];

  record(type: string, value: number): void {
    this.metrics.push({ timestamp: Date.now(), type, value });
  }

  query(type?: string): MetricEntry[] {
    if (!type) return [...this.metrics];
    return this.metrics.filter((m) => m.type === type);
  }

  clear(): void {
    this.metrics = [];
  }
}
