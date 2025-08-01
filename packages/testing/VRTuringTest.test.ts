import { runVRTuringTest } from './VRTuringTest';

describe('VRTuringTest', () => {
  it('returns message', () => {
    expect(runVRTuringTest('hi')).toBe('VR-Turing-Test: hi');
  });
});
