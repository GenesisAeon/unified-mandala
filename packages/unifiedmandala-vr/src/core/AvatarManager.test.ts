const { AvatarManager } = require('./AvatarManager');

describe('AvatarManager', () => {
  it('adds and retrieves avatars', () => {
    const manager = new AvatarManager();
    manager.addAvatar({ id: '1', name: 'Test', type: 'human' });
    expect(manager.getAvatars()).toHaveLength(1);
  });

  it('removes avatars', () => {
    const manager = new AvatarManager();
    manager.addAvatar({ id: '1', name: 'Test', type: 'human' });
    manager.removeAvatar('1');
    expect(manager.getAvatars()).toHaveLength(0);
  });
});
