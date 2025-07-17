import { describe, it, expect } from 'vitest';
import { ExtendedResonanceModule } from './ExtendedResonanceModule';

describe('ExtendedResonanceModule', () => {
  it('modulates value', () => {
    const m = new ExtendedResonanceModule();
    expect(m.modulate(2)).toBe(3);
  });
});
