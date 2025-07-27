import { describe, it, expect } from 'vitest';
import { ResonanceAutoTuner } from './ResonanceAutoTuner';

describe('ResonanceAutoTuner wrapper', () => {
  it('delegates tuning to core tuner', () => {
    const tuner = new ResonanceAutoTuner();
    const res = tuner.tune({ frequency: 1, intensity: 1 }, [0.5]);
    expect(res.frequency).toBeGreaterThan(1);
  });
});
