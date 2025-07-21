import { describe, it, expect } from 'vitest';
import { VRResonanceAvatar } from './VRResonanceAvatar';

describe('VRResonanceAvatar', () => {
  it('updates level', () => {
    const av = new VRResonanceAvatar();
    av.update(5);
    expect(av.getLevel()).toBe(5);
  });
});
