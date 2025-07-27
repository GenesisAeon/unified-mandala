import { describe, it, expect } from 'vitest';
import { autoTune, AutoTuneParams } from './ResonanceAutoTuner';

describe('autoTune', () => {
  it('adjusts params based on feedback average', () => {
    const params: AutoTuneParams = { frequency: 100, amplitude: 1 };
    const tuned = autoTune(params, [0.1, 0.1]);
    expect(tuned.frequency).toBeCloseTo(110);
    expect(tuned.amplitude).toBeCloseTo(1.05);
  });
});
