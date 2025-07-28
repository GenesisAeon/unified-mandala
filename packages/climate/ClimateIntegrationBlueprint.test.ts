import { describe, it, expect } from 'vitest';
import { integrateSolarForcing } from './ClimateIntegrationBlueprint';

describe('integrateSolarForcing', () => {
  it('computes forcing based on averages', () => {
    const forcing = integrateSolarForcing({irradiance:[1,1,1], albedo:[0.5,0.5,0.5]});
    expect(forcing).toBeCloseTo(1 * (1-0.5));
  });
});
