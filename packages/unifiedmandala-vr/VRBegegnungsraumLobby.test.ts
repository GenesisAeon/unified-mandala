import { describe, it, expect } from 'vitest';
import { VRBegegnungsraumLobby } from './VRBegegnungsraumLobby';

describe('VRBegegnungsraumLobby', () => {
  it('returns lobby', () => {
    expect(VRBegegnungsraumLobby()).toBe('lobby');
  });
});
