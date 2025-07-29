import { describe, it, expect } from 'vitest';
import { BoundaryWaveFieldVisualizer, WaveSource } from '../BoundaryWaveFieldVisualizer';

describe('BoundaryWaveFieldVisualizer', () => {
  it('calculates wave interference', () => {
    const vis = new BoundaryWaveFieldVisualizer();
    vis.addSource({ amplitude: 1, frequency: 1, phase: 0 });
    const val = vis.calculateField(0, 0);
    expect(val).toBeCloseTo(0);
  });
});
