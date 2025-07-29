import { describe, it, expect, vi } from 'vitest';
import { VRResonancePortal } from './VRResonancePortal';

describe('VRResonancePortal', () => {
  it('delegates navigation to VRBegegnungsraum', () => {
    const room = { join: vi.fn() } as any;
    const portal = new VRResonancePortal(room);
    portal.navigate('scene');
    expect(room.join).toHaveBeenCalledWith('scene');
  });
});
