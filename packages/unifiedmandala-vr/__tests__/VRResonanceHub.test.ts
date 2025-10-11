import { describe, it, expect } from 'vitest';
import { VRResonanceHub } from '../VRResonanceHub';

describe('VRResonanceHub', () => {
  it('broadcasts resonance to listeners', () => {
    const hub = new VRResonanceHub();
    let val = 0;
    hub.join((v) => (val = v));
    hub.broadcast(5);
    expect(val).toBe(5);
  });
});
