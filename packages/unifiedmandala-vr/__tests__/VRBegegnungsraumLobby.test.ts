import { VRBegegnungsraumLobby } from '../VRBegegnungsraumLobby';
import { describe, it, expect } from 'vitest';

describe('VRBegegnungsraumLobby', () => {
  it('returns lobby', () => {
    expect(VRBegegnungsraumLobby()).toBe('lobby');
  });
});
