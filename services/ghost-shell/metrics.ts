import { Counter, Gauge } from 'prom-client';

export const connectionCounter = new Counter({
  name: 'ghost_connections_total',
  help: 'Total WS connections'
});

export const responseLatencyGauge = new Gauge({
  name: 'ghost_response_latency_ms',
  help: 'Response latency ms'
});

export function recordConnection(): void {
  connectionCounter.inc();
}

export function recordLatency(ms: number): void {
  responseLatencyGauge.set(ms);
}
