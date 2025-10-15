import { it, expect } from 'vitest';
import { RealMembrane } from '../../src/membrane/real-membrane';

const BENCH = process.env.BENCH === '1';

(BENCH ? it : it.skip)('p95 under budget', () => {
  const m = new RealMembrane({ N: 200, H: 0.2, K: 3, T_OK: 1, T_WARN: 2, SIGMA_MIN: 1e-3 });
  const start = performance.now();
  for (let i = 0; i < 100_000; i += 1) {
    m.step(i, Math.sin(i / 9) + Math.sin(i / 13) * 0.01);
  }
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(1500);
});
