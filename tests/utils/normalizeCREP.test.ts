import { describe, it, expect } from 'vitest';
import { normalizeCREP as normalizeLoose } from '../../src/utils/normalizeCREP';

describe('utils/normalizeCREP (loose)', () => {
  it('uses explicit score and clamps 0..1', () => {
    expect(normalizeLoose({ score: 1.2 })!.score).toBe(1);
    expect(normalizeLoose({ score: -0.4 })!.score).toBe(0);
  });

  it('averages provided parts (lowercase)', () => {
    const res = normalizeLoose({ coherence: 0.5, resonance: 0.8 });
    expect(res).toBeDefined();
    expect(res!.parts.coherence).toBe(0.5);
    expect(res!.parts.resonance).toBe(0.8);
    // avg of provided numbers
    expect(res!.score).toBeCloseTo((0.5 + 0.8) / 2, 6);
  });

  it('supports uppercase and single-letter keys', () => {
    const a = normalizeLoose({ C: 0.2, R: 0.4, E: 0.6, P: 0.9 });
    expect(a!.score).toBeCloseTo((0.2 + 0.4 + 0.6 + 0.9) / 4, 6);

    const b = normalizeLoose({ c: 0.4, p: 0.6 });
    expect(b!.parts.coherence).toBe(0.4);
    expect(b!.parts.poetics).toBe(0.6);
    expect(b!.score).toBeCloseTo(0.5, 6);
  });

  it('returns undefined when nothing numeric present', () => {
    expect(normalizeLoose(undefined as any)).toBeUndefined();
    expect(normalizeLoose({ foo: 'bar' } as any)).toBeUndefined();
  });
});
