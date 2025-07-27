import { describe, it, expect } from 'vitest';
import { soundResonanceVR } from './SoundResonanceVR';

describe('soundResonanceVR', () => {
  it('generates 3D resonance data', () => {
    const data = soundResonanceVR(Math.PI, 1, 4);
    expect(data).toHaveLength(4);
    expect(data[0]).toHaveProperty('x');
    expect(data[0]).toHaveProperty('y');
    expect(data[0]).toHaveProperty('z');
  });
});
