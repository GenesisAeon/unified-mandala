/**
 * FederatedMetaAgent utilities.
 * Aggregates anonymous metrics from multiple Mandala instances.
 */

export interface Metric {
  /** unique instance identifier */
  instance: string;
  /** metric count for the instance */
  count: number;
}

/**
 * Aggregate metrics counts per instance.
 */
export function aggregateMetrics(metrics: Metric[]): Record<string, number> {
  return metrics.reduce<Record<string, number>>((acc, { instance, count }) => {
    acc[instance] = (acc[instance] ?? 0) + count;
    return acc;
  }, {});
}
