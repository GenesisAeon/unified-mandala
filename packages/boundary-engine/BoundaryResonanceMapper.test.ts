import { describe, it, expect } from 'vitest';
import { mapBoundaryToResonance } from './BoundaryResonanceMapper';

describe('BoundaryResonanceMapper', () => {
  it('maps rule to resonance', () => {
    expect(mapBoundaryToResonance('r')).toBe('mapped:r');
  });
});
