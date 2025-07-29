import { VRBegegnungsraumLobby } from '../VRBegegnungsraumLobby';
import { describe, it, expect } from 'vitest';

describe('VRBegegnungsraumLobby', () => {
  it('manages participants', () => {
    const lobby = new VRBegegnungsraumLobby();
    lobby.enter('user');
    expect(lobby.getParticipants()).toEqual(['user']);
  });

  it('initiates handshake', () => {
    const lobby = new VRBegegnungsraumLobby();
    expect(lobby.initiateHandshake('fourier')).toBe('handshake:fourier');
    expect(lobby.initiateHandshake('fourier', { breathSync: true })).toBe(
      'handshake:fourier:breath-sync'
    );
  });
});
