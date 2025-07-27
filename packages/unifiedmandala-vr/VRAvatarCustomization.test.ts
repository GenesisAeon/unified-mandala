import { describe, it, expect } from 'vitest';
import { VRAvatarCustomization } from './VRAvatarCustomization';

describe('VRAvatarCustomization', () => {
  it('applies options', () => {
    const c = new VRAvatarCustomization();
    expect(c.customize('user', { texture: 'metal', color: 'red' })).toBe('user:metal:red');
  });
});
