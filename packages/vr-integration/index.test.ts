import { describe, it, expect } from 'vitest';
import { VirtualSpace } from './index';

describe('VirtualSpace', () => {
  it('stores added objects', () => {
    const space = new VirtualSpace();
    space.addObject({ id: '1', type: 'sphere', position: { x: 0, y: 0, z: 0 } });
    expect(space.getObjects().length).toBe(1);
  });
});
