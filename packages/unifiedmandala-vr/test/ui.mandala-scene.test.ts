import { describe, it, expect, vi } from 'vitest';

// Mock three to avoid WebGL/env requirements
vi.mock('three', () => {
  class Scene { add = vi.fn(); }
  class CircleGeometry { constructor(_r: number, _s: number) {} }
  class MeshStandardMaterial { constructor(_opts: any) {} }
  class Mesh { rotation = { x: 0 }; constructor(_g: any, _m: any) {} }
  return {
    default: {} as any,
    Scene,
    CircleGeometry,
    MeshStandardMaterial,
    Mesh,
  };
});

import { MandalaScene } from '../src/ui/MandalaScene';

describe('VR UI - MandalaScene', () => {
  it('sets up environment and exposes scene', () => {
    const m = new MandalaScene();
    m.setupEnvironment();
    const scene = m.getScene() as any;
    expect(typeof scene.add).toBe('function');
  });
});

