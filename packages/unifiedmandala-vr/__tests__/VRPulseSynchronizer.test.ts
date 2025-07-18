import { describe, it, expect } from 'vitest';
import { VRPulseSynchronizer } from '../VRPulseSynchronizer';

describe('VRPulseSynchronizer', () => {
  it('notifies listeners on sync', () => {
    const sync = new VRPulseSynchronizer();
    let received = 0;
    sync.onPulse(p => {
      received = p;
    });
    sync.sync(42);
    expect(received).toBe(42);
  });
});
