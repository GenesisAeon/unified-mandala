import { describe, it, expect } from 'vitest';
import { CREPSchema } from '../crep';

describe('schemas/CREP', () => {
  it('accepts partial valid object', () => {
    const res = CREPSchema.safeParse({ score: 0.8, coherence: 0.1 });
    expect(res.success).toBe(true);
  });

  it('rejects out-of-range values', () => {
    const res = CREPSchema.safeParse({ score: 2 });
    expect(res.success).toBe(false);
  });

  it('rejects unknown keys due to strict()', () => {
    const res = CREPSchema.safeParse({ foo: 1 });
    expect(res.success).toBe(false);
  });
});
