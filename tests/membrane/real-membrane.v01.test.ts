import { describe, it, expect } from 'vitest';
import { RealMembrane } from '../../src/membrane/real-membrane';

function feed(m: RealMembrane, xs: number[]) {
  const t0 = Date.now();
  if (xs.length === 0) {
    throw new Error('feed requires at least one sample');
  }
  let last = m.step(t0, xs[0]);
  for (let i = 1; i < xs.length; i += 1) {
    last = m.step(t0 + i * 1000, xs[i]);
  }
  return last;
}

describe('RealMembrane v0.1', () => {
  it('stays subcritical around baseline with noise', () => {
    const m = new RealMembrane();
    const noise = Array.from({ length: 50 }, (_, i) => Math.sin(i / 5) * 0.05);
    const r = feed(m, noise.length ? noise : [0]);
    expect(r.state).toBe('subcritical');
    expect(r.severity).toBe('ok');
  });

  it('enters apparent near threshold with positive delta A', () => {
    const m = new RealMembrane({ T_ok: 0.8, T_warn: 1.6, H: 0.2, K: 2, sigmaMin: 1e-3, N: 200 });
    feed(m, Array(20).fill(0));
    const r = feed(m, [0, 0, 1.6, 1.8, 1.7, 1.9]);
    expect(['apparent', 'event']).toContain(r.state);
  });

  it('debounces before switching to event', () => {
    const m = new RealMembrane({ K: 3 });
    feed(m, Array(20).fill(0));
    const start = Date.now();
    m.step(start, 3.0);
    const second = m.step(start + 1000, 3.5);
    expect(second.state).not.toBe('event');
    const third = m.step(start + 2000, 4.0);
    expect(third.state).toBe('event');
    expect(third.severity).toBe('alarm');
  });

  it('hysteresis prevents flapping back immediately', () => {
    const m = new RealMembrane({ H: 0.3, K: 2 });
    feed(m, Array(20).fill(0));
    feed(m, [3, 3, 3]);
    const r = feed(m, [1.9, 1.8]);
    expect(['event', 'apparent']).toContain(r.state);
  });
});
