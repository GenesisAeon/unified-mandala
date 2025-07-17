import { VRSceneLoader } from '../VRSceneLoader';
import { describe, it, expect } from 'vitest';

describe('VRSceneLoader', () => {
  it('loads scenes', async () => {
    const loader = new VRSceneLoader();
    await expect(loader.load('a.glb')).resolves.toBe('loaded:a.glb');
  });
});
