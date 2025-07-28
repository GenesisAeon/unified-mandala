import { describe, it, expect } from 'vitest';
import { ExtendedResonanceModule } from './ExtendedResonanceModule';

describe('ExtendedResonanceModule', () => {
  it('modulates value', () => {
    const m = new ExtendedResonanceModule();
    expect(m.modulate(2)).toBe(3);
  });

  it('analyzes amplitude and phase', () => {
    const m = new ExtendedResonanceModule();
    expect(m.analyzeAmplitude([1, 3, 8])).toBe(7);
    expect(m.analyzePhase([1, 3, 5])).toBeCloseTo(3);
  });
});
