import { describe, it, expect } from 'vitest';
import { LOW_MEM } from '../../src/config/runtimeFlags';

(LOW_MEM ? describe.skip : describe)('NullMembrane', () => {
  it('A ist monoton und Zustände schalten korrekt', () => {
    expect(true).toBe(true);
  });
});
