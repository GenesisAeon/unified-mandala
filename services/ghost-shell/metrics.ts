import { getOrCreateCounter, getOrCreateGauge } from '../../src/metrics/singleton';

export const connectionCounter = getOrCreateCounter({
  name: 'ghost_connections_total',
  help: 'Total WS connections',
});

export const responseLatencyGauge = getOrCreateGauge({
  name: 'ghost_response_latency_ms',
  help: 'Response latency ms',
});

export function recordConnection(): void {
  connectionCounter.inc();
}

export function recordLatency(ms: number): void {
  responseLatencyGauge.set(ms);
}
