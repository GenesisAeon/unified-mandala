import { describe, it, expect } from 'vitest';

describe('membrane/real-membrane NullMembrane', () => {
  it('step returns subcritical ok reading', async () => {
    const mod = await import('../../src/membrane/real-membrane');
    const Mem = mod.NullMembrane;
    const inst = new Mem();
    const r = inst.step(1000, 3.14);
    expect(r).toMatchObject({ t: 1000, value: 3.14, severity: 'ok', state: 'subcritical' });
  });
});
