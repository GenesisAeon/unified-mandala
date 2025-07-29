import { describe, it, expect } from 'vitest';
import { BoundaryWaveSimulator } from './BoundaryWaveSimulator';

describe('BoundaryWaveSimulator', () => {
  it('simulates sine wave steps', () => {
    const sim = new BoundaryWaveSimulator();
    const result = sim.simulate(1, 4);
    expect(result.length).toBe(4);
    expect(result[0]).toBeCloseTo(0);
  });
});
