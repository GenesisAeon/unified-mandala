import { describe, it, expect } from 'vitest';
import { PantheonAvatarHub } from './PantheonAvatarHub';

describe('PantheonAvatarHub', () => {
  it('registers and lists avatars', () => {
    const hub = new PantheonAvatarHub();
    hub.register({ id: '1', name: 'A' });
    expect(hub.list()).toHaveLength(1);
  });
});
