import { VRBegegnungsraumLobby, initiateHandshake } from '../VRBegegnungsraumLobby';
import { describe, it, expect } from 'vitest';

describe('VRBegegnungsraumLobby', () => {
  it('returns lobby', () => {
    expect(VRBegegnungsraumLobby()).toBe('lobby');
  });

  it('initiates handshake', () => {
    expect(initiateHandshake('fourier')).toBe('handshake:fourier');
  });
});
