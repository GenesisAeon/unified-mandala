import { describe, it, expect } from 'vitest';
import { VRBegegnungsraum } from './VRBegegnungsraum';
import { PantheonBoundaryBridge } from '../pantheon/PantheonBoundaryBridge';
import { VRBoundaryConductor } from './VRBoundaryConductor';

describe('VRBoundaryConductor', () => {
  it('passes handshake events to boundary bridge', () => {
    const vr = new VRBegegnungsraum();
    let bridged: any[] | null = null;
    const bridge = new PantheonBoundaryBridge(m => {
      bridged = m;
    });
    const conductor = new VRBoundaryConductor(vr, bridge, [/^xr-/]);
    conductor.start();
    vr.handshake('peer');
    expect(bridged).toEqual([{ rule: /^xr-/, occurrences: 1 }]);
    conductor.stop();
  });
});
