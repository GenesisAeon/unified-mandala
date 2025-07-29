import { describe, it, expect } from 'vitest';
import { VRResonancePortal } from './VRResonancePortal';

describe('VRResonancePortal', () => {
  it('opens portal', () => {
    const portal = new VRResonancePortal();
    expect(portal.open()).toBe('VR Resonance Portal opened');
  });
});
