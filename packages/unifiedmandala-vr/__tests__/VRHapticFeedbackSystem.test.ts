import { describe, it, expect } from 'vitest';
import { VRHapticFeedbackSystem } from '../VRHapticFeedbackSystem';

describe('VRHapticFeedbackSystem', () => {
  it('triggers feedback', () => {
    const sys = new VRHapticFeedbackSystem();
    expect(sys.trigger(1)).toBe('haptic:1');
  });
});
