import { describe, it, expect } from 'vitest';
import { FourierLayerBridge } from '../src/core/FourierLayerBridge';

describe('VR Core - FourierLayerBridge', () => {
  it('connect returns data unchanged', () => {
    const b = new FourierLayerBridge();
    const input = [1, 2, 3];
    expect(b.connect(input)).toEqual(input);
  });
});

