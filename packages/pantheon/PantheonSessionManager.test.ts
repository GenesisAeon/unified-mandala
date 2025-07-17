import { describe, it, expect } from 'vitest';
import { PantheonSessionManager } from './PantheonSessionManager';

describe('PantheonSessionManager', () => {
  it('tracks sessions', () => {
    const mgr = new PantheonSessionManager();
    mgr.startSession('a');
    expect(mgr.getActiveSessions()).toContain('a');
    mgr.endSession('a');
    expect(mgr.getActiveSessions()).not.toContain('a');
  });
});
