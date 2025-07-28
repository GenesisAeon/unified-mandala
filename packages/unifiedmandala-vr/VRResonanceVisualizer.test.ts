import { describe, it, expect } from 'vitest';
import { VRResonanceVisualizer } from './VRResonanceVisualizer';

describe('VRResonanceVisualizer', () => {
  it('computes color', () => {
    const v = new VRResonanceVisualizer();
    expect(v.computeColor(0)).toBe('rgb(0,255,128)');
  });
});
