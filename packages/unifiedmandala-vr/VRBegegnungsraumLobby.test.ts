import { VRBegegnungsraumLobby } from './VRBegegnungsraumLobby';
import { describe, it, expect } from 'vitest';

describe('VRBegegnungsraumLobby', () => {
  it('returns lobby string', () => {
    expect(VRBegegnungsraumLobby()).toBe('lobby');
  });
});
