import { describe, it, expect } from 'vitest';
import { ExtendedResonanceVRModule } from './ExtendedResonanceVRModule';

describe('ExtendedResonanceVRModule', () => {
  it('applies feedback', () => {
    const m = new ExtendedResonanceVRModule();
    expect(m.applyFeedback(1)).toBeCloseTo(1.1);
  });

  it('computes Fourier transform', () => {
    const m = new ExtendedResonanceVRModule();
    const out = m.applyFourier([1, 0, 0, 0]);
    expect(out.length).toBe(4);
    expect(out[0]).toBeCloseTo(0.25, 2);
  });
});
