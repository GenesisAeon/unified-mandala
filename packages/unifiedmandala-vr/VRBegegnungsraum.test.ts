import { describe, it, expect } from 'vitest';
import { VRBegegnungsraum } from './VRBegegnungsraum';

describe('VRBegegnungsraum', () => {
  it('triggers handshake callbacks', () => {
    const vr = new VRBegegnungsraum();
    let session = '';
    vr.onHandshake((id) => {
      session = id;
    });
    const id = vr.handshake('peer1');
    expect(id).toBe('xr-peer1');
    expect(session).toBe('xr-peer1');
  });
});
