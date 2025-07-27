import { describe, it, expect } from 'vitest';
import { ResonanceModuleSynth, SynthParams } from '../ResonanceModuleSynth';

describe('ResonanceModuleSynth', () => {
  it('generates a buffer for given frequencies', () => {
    const synth = new ResonanceModuleSynth(1000);
    const params: SynthParams = { frequencies: [10, 20], gain: 1 };
    const buf = synth.synthesize(params, 0.1);
    expect(buf.length).toBe(100);
    const max = Math.max(...buf);
    expect(max).toBeLessThanOrEqual(1);
  });
});
