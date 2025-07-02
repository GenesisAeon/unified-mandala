import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { BewusstseinsResonanzComparator } from './BewusstseinsResonanzComparator';

describe('BewusstseinsResonanzComparator', () => {
  it('compares values correctly', () => {
    const comp = new BewusstseinsResonanzComparator();
    expect(comp.compare(5, 7)).toContain('übersteigt');
    expect(comp.compare(7, 5)).toContain('über Resonanz');
    expect(comp.compare(5, 5)).toContain('Gleichgewicht');
  });
});
