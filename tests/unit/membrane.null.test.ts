import { describe, it, expect } from 'vitest';
import { RealMembrane } from '../../src/membrane/real-membrane';

const LOW_MEM = process.env.LOW_MEM === '1';

(LOW_MEM ? describe.skip : describe)('RealMembrane dynamics', () => {
  it('amplitude grows when values drift', () => {
    const membrane = new RealMembrane({ N: 10, K: 1 });
    const start = Date.now();
    const baseline = Array.from({ length: 10 }, (_, i) => membrane.step(start + i * 1000, 0));
    expect(baseline.at(-1)?.state).toBe('subcritical');

    const stressed = membrane.step(Date.now() + 1000, 4);
    expect(stressed.A).toBeGreaterThan(baseline.at(-1)!.A);
    expect(['apparent', 'event']).toContain(stressed.state);
  });
});
