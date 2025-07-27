import { describe, it, expect } from 'vitest';
import { VRAvatarCustomization } from './VRAvatarCustomization';

describe('VRAvatarCustomization', () => {
  it('stores avatar options', () => {
    const c = new VRAvatarCustomization();
    c.setOptions({ color: 'red' });
    expect(c.getOptions()).toEqual({ color: 'red' });
  });
});
