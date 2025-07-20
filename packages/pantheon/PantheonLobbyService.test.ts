import { describe, it, expect } from 'vitest';
import { PantheonLobbyService } from './PantheonLobbyService';

describe('PantheonLobbyService', () => {
  it('tracks sessions', () => {
    const svc = new PantheonLobbyService();
    svc.join('a');
    expect(svc.has('a')).toBe(true);
    svc.leave('a');
    expect(svc.has('a')).toBe(false);
  });
});
