import { describe, it, expect } from 'vitest';
import { ArcticGravityWaveSimulation } from './ArcticGravityWaveSimulation';

describe('ArcticGravityWaveSimulation', () => {
  it('computes wave height at t=0', () => {
    const sim = new ArcticGravityWaveSimulation({ amplitude: 2, frequency: 0.5 });
    expect(sim.height(0)).toBeCloseTo(0);
  });

  it('computes wave height at quarter period', () => {
    const sim = new ArcticGravityWaveSimulation({ amplitude: 2, frequency: 0.5 });
    const t = 0.5; // period = 2s; quarter period = 0.5s
    expect(sim.height(t)).toBeCloseTo(2);
  });
});
