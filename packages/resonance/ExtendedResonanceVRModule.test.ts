import { describe, it, expect } from 'vitest';
import { ExtendedResonanceVRModule } from './ExtendedResonanceVRModule';

describe('ExtendedResonanceVRModule', () => {
  it('applies feedback', () => {
    const m = new ExtendedResonanceVRModule();
    expect(m.applyFeedback(1)).toBeCloseTo(1.1);
  });
});
