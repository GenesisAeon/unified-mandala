import { describe, it, expect } from 'vitest';
import { createFourierLayerTree } from './createFourierLayerTree';

describe('createFourierLayerTree', () => {
  it('creates child layers', () => {
    const tree = createFourierLayerTree([[1,2],[3,4]], { depth: 1 });
    expect(tree.children.length).toBe(2);
  });
});
