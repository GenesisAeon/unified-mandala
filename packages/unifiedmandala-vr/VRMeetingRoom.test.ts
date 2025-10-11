import { describe, it, expect } from 'vitest';
import { VRMeetingRoom } from './VRMeetingRoom';

class DummyLoader {
  loadCalled = false;
  load() {
    this.loadCalled = true;
    return Promise.resolve();
  }
}

describe('VRMeetingRoom', () => {
  it('connect calls loader', async () => {
    const loader = new DummyLoader();
    const room = new VRMeetingRoom(loader as any);
    await room.connect('url');
    expect(loader.loadCalled).toBe(true);
  });

  it('broadcast returns peer messages', () => {
    const room = new VRMeetingRoom({ load: () => Promise.resolve() } as any);
    expect(room.broadcast('hi', ['a', 'b'])).toEqual(['a:hi', 'b:hi']);
  });
});
