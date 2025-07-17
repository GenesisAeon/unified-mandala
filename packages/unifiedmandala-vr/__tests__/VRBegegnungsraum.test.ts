import { describe, it, expect } from 'vitest';
import { VRBegegnungsraum } from '../VRBegegnungsraum';
import { VRSceneLoader } from '../VRSceneLoader';

describe('VRBegegnungsraum', () => {
  it('loads scene', async () => {
    const loader = new VRSceneLoader();
    const room = new VRBegegnungsraum(loader);
    await expect(room.join('scene')).resolves.toBe('loaded:scene');
  });
});
