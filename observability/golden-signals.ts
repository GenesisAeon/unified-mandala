export interface GoldenSignalsMetrics {
  p95Latency: number;
  successRate: number;
  queueDepth: number;
  retries: number;
}

/**
 * Calculate golden signal metrics.
 * @param latencies array of request latencies in milliseconds
 * @param successes number of successful requests
 * @param totalRequests total number of requests attempted
 * @param queueDepth current depth of the processing queue
 * @param retries number of retry attempts performed
 */
export function calculateGoldenSignals(
  latencies: number[],
  successes: number,
  totalRequests: number,
  queueDepth: number,
  retries: number
): GoldenSignalsMetrics {
  const sorted = [...latencies].sort((a, b) => a - b);
  let p95Latency = 0;
  if (sorted.length) {
    const pos = 0.95 * (sorted.length - 1);
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    const lowerVal = sorted[lower];
    const upperVal = sorted[upper];
    p95Latency =
      lowerVal + (upperVal - lowerVal) * (pos - lower);
  }
  const successRate = totalRequests > 0 ? successes / totalRequests : 0;
  return {
    p95Latency,
    successRate,
    queueDepth,
    retries,
  };
}
