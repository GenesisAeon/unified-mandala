import { describe, it, expect } from 'vitest';
import { keyOf, ok, fail } from '../base';

describe('base utilities', () => {
  it('keyOf sorts params keys deterministically', () => {
    const k1 = keyOf({ params: { b: 2, a: 1 } });
    const k2 = keyOf({ params: { a: 1, b: 2 } });
    expect(k1).toBe(k2);
  });

  it('ok and fail shape adapters results', () => {
    const good = ok(123, { tag: 'x' });
    expect(good.ok).toBe(true);
    expect(good.data).toBe(123);
    expect(good.meta?.tag).toBe('x');

    const bad = fail('nope', { code: 400 });
    expect(bad.ok).toBe(false);
    expect(bad.error).toBe('nope');
    expect(bad.meta?.code).toBe(400);
  });
});
