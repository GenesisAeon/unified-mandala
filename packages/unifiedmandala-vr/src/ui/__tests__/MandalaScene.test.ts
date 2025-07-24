import { describe, it, expect } from 'vitest';
import { MandalaScene } from '../MandalaScene';

describe('MandalaScene', () => {
  it('initializes scene', () => {
    const scene = new MandalaScene();
    scene.setupEnvironment();
    expect(scene.getScene()).toBeTruthy();
  });
});
