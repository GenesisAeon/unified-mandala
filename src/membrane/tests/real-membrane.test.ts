import { describe, it, expect } from 'vitest';
import { RealMembrane } from '../index';

type MembraneInstance = InstanceType<typeof RealMembrane>;

function feed(m: MembraneInstance, values: number[], start = Date.now(), stepMs = 1000) {
  let reading;
  values.forEach((value, idx) => {
    reading = m.step(start + idx * stepMs, value);
  });
  return reading!;
}

describe('RealMembrane v0.1 heuristics', () => {
  it('stays subcritical around a stable baseline', () => {
    const m = new RealMembrane();
    const noise = Array.from({ length: 60 }, (_, i) => Math.sin(i / 5) * 0.05);
    const r = feed(m, noise);
    expect(r.state).toBe('subcritical');
    expect(r.severity).toBe('ok');
    expect(r.A).toBeLessThan(1);
  });

  it('elevates to apparent when A approaches threshold or delta spikes', () => {
    const m = new RealMembrane({
      thresholdOk: 1.2,
      thresholdWarn: 2,
      hysteresis: 0.2,
      debounce: 2,
    });
    feed(m, Array(20).fill(0));
    const r = feed(m, [0, 0, 1.4, 1.45]);
    expect(['apparent', 'event']).toContain(r.state);
    expect(['warn', 'alarm']).toContain(r.severity);
  });

  it('debounces transitions into the event state', () => {
    const m = new RealMembrane({ debounce: 3 });
    feed(m, Array(20).fill(0));
    feed(m, [3.0, 3.0]);
    const interim = m.step(Date.now(), 3.0);
    expect(interim.state).toBe('event');
    expect(interim.severity).toBe('alarm');
  });

  it('applies hysteresis to avoid rapid flapping', () => {
    const m = new RealMembrane({ hysteresis: 0.3, debounce: 2 });
    feed(m, Array(20).fill(0));
    feed(m, [3, 3, 3]);
    const r = feed(m, [1.9, 1.8]);
    expect(['event', 'apparent']).toContain(r.state);
  });
});
