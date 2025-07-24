import { describe, it, expect } from 'vitest';
import { ResonanceAutoTuner, ResonanceParameters } from '../ResonanceAutoTuner';

describe('ResonanceAutoTuner', () => {
  it('tunes parameters based on average feedback', () => {
    const tuner = new ResonanceAutoTuner();
    const params: ResonanceParameters = { frequency: 100, intensity: 1 };
    const result = tuner.tune(params, [0.1, 0.1]);
    expect(result.frequency).toBeCloseTo(110);
    expect(result.intensity).toBeCloseTo(1.05);
  });
});
