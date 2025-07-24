import { describe, it, expect } from 'vitest';
import { ResonanceAutoTuner } from '../ResonanceAutoTuner';

describe('ResonanceAutoTuner', () => {
  it('averages current and target frequency', () => {
    const t = new ResonanceAutoTuner();
    expect(t.tune(10, 20)).toBe(15);
  });
});
