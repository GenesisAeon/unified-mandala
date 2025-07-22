import { describe, it, expect } from 'vitest';
import { synthesizeTone } from './ResonanceModuleSynth';

describe('ResonanceModuleSynth', () => {
  it('creates tone string', () => {
    expect(synthesizeTone(440)).toBe('tone:440');
  });
});
