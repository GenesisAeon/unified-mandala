import { describe, it, expect } from 'vitest';
import { evolveGreen } from '../../../src/modules/ki/evolve_green';

describe('evolve_green', () => {
  it('keeps only items containing "green" (case-insensitive)', () => {
    const out = evolveGreen(['Green path', 'BLUE', 'eco-green', 'plain']);
    expect(out).toEqual(['Green path', 'eco-green']);
  });
});
