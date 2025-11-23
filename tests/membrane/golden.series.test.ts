import { describe, it, expect } from 'vitest';
import { RealMembrane } from '../../src/membrane/real-membrane';

describe('RealMembrane golden', () => {
  it('deterministic over identical input', () => {
    const series = Array.from({ length: 200 }, (_, i) => Math.sin(i / 10) + (i > 140 ? 2.5 : 0));
    const run = () => {
      const m = new RealMembrane({ N: 50, H: 0.2, K: 3, T_OK: 1, T_WARN: 2, SIGMA_MIN: 1e-3 });
      return series.map((v, i) => m.step(i, v));
    };
    expect(run()).toEqual(run());
  });

  it('limits flip-flops around the hysteresis band', () => {
    const m = new RealMembrane({ N: 80, H: 0.35, K: 5, T_OK: 1, T_WARN: 2, SIGMA_MIN: 1e-3 });
    const hover = [...Array(60).fill(1.9), ...Array(20).fill(2.05), ...Array(60).fill(1.9)];
    const out = hover.map((v, i) => m.step(i, v));
    const flips = out.reduce((n, reading, idx, arr) => {
      if (idx === 0) return 0;
      return n + (reading.state !== arr[idx - 1].state ? 1 : 0);
    }, 0);
    expect(flips).toBeLessThanOrEqual(3);
  });
});
