import { describe, it, expect } from 'vitest';
import { VRMeetingRoom } from './VRMeetingRoom';

describe('VRMeetingRoom', () => {
  it('stores avatars that join', () => {
    const room = new VRMeetingRoom();
    room.join({id:'a', position:[0,0,0]});
    expect(room.list()).toHaveLength(1);
  });
});
