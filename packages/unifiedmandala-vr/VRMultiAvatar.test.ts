import { describe, it, expect } from 'vitest';
import { VRMultiAvatar } from './VRMultiAvatar';

describe('VRMultiAvatar', () => {
  it('stores multiple avatars', () => {
    const multi = new VRMultiAvatar();
    multi.addAvatar('a');
    multi.addAvatar('b');
    expect(multi.listAvatars()).toEqual(['a', 'b']);
  });
});
