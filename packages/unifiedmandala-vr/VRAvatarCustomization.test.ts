import { describe, it, expect } from 'vitest';
import { VRAvatarCustomization } from './VRAvatarCustomization';

describe('VRAvatarCustomization', () => {
  it('merges and retrieves options', () => {
    const c = new VRAvatarCustomization();
    c.setOptions({ color: 'blue' });
    c.setOptions({ accessory: 'hat' });
    expect(c.getOptions()).toEqual({ color: 'blue', accessory: 'hat' });
  });
});
