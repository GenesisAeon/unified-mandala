import { describe, it, expect } from 'vitest';
import { CREPSchema } from '../../src/schemas/crep';

describe('schemas/CREPSchema', () => {
  it('accepts valid partial or full CREP objects', () => {
    expect(CREPSchema.parse({ coherence: 0.5, resonance: 0.6 })).toEqual({
      coherence: 0.5,
      resonance: 0.6,
    });
    expect(
      CREPSchema.parse({
        score: 0.7,
        coherence: 0.2,
        resonance: 0.3,
        emergence: 0.4,
        poetics: 0.5,
      }),
    ).toMatchObject({ score: 0.7, coherence: 0.2, resonance: 0.3, emergence: 0.4, poetics: 0.5 });
  });

  it('rejects out-of-range values and extra fields', () => {
    expect(() => CREPSchema.parse({ coherence: 1.5 } as any)).toThrow();
    expect(() => CREPSchema.parse({ coherence: -0.1 } as any)).toThrow();
    expect(() => CREPSchema.parse({ foo: 1 } as any)).toThrow();
  });
});
