import { describe, it, expect } from 'vitest';
import { AvatarManager } from '../src/core/AvatarManager';

describe('VR Core - AvatarManager', () => {
  it('adds and retrieves avatars', () => {
    const m = new AvatarManager();
    m.addAvatar({ id: '1', name: 'Alice', type: 'human' });
    m.addAvatar({ id: '2', name: 'Aeon', type: 'ai' });
    const list = m.getAvatars();
    expect(list.map((a) => a.id).sort()).toEqual(['1', '2']);
  });

  it('removes avatars', () => {
    const m = new AvatarManager();
    m.addAvatar({ id: '1', name: 'Alice', type: 'human' });
    m.removeAvatar('1');
    expect(m.getAvatars()).toHaveLength(0);
  });
});

