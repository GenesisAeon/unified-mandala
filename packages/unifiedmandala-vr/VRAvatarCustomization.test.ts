import { describe, it, expect } from 'vitest';
import { VRAvatarCustomization } from './VRAvatarCustomization';

describe('VRAvatarCustomization', () => {
  it('returns customized avatar config', () => {
    const customizer = new VRAvatarCustomization();
    const cfg = customizer.customize('id1', { color: 'red', scale: 2 });
    expect(cfg).toEqual({ id: 'id1', color: 'red', scale: 2 });
  });
});
