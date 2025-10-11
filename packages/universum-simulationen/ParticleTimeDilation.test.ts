import { simulateParticleTimeDilation } from './ParticleTimeDilation';

test('simulates relativistic particle behavior', () => {
  const res = simulateParticleTimeDilation({ velocityFraction: 0.5, energy: 1e6 });
  expect(res.timeFactor).toBeCloseTo(1.1547, 4);
  expect(res.convertedMass).toBeCloseTo(1e6 / 299792458 ** 2);
  expect(res.gasVolume).toBeGreaterThan(0);
});
