import {
  connectionCounter,
  responseLatencyGauge,
  recordConnection,
  recordLatency,
} from './metrics';

describe('ghost-shell metrics', () => {
  it('tracks connections and latency', async () => {
    const before = (await connectionCounter.get()).values[0]?.value ?? 0;
    recordConnection();
    const after = (await connectionCounter.get()).values[0]?.value ?? 0;
    expect(after).toBe(before + 1);

    recordLatency(42);
    const latency = (await responseLatencyGauge.get()).values[0]?.value;
    expect(latency).toBe(42);
  });
});
