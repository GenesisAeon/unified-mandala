import { describe, it, expect } from 'vitest';
import { RealMembrane } from '../../src/membrane/real-membrane';

describe('membrane/real-membrane', () => {
  it('step returns reading with horizon metrics', () => {
    const inst = new RealMembrane();
    const r = inst.step(1000, 3.14);
    expect(r).toMatchObject({ t: 1000, value: 3.14 });
    expect(Number.isFinite(r.A)).toBe(true);
    expect(Number.isFinite(r.dA)).toBe(true);
    expect(['subcritical', 'apparent', 'event']).toContain(r.state);
  });
});
