import { simulateNullfeld } from './NullfeldSimulation';

test('calculates forces, curvature effect and energy-mass conversion', () => {
  const result = simulateNullfeld([1, 2], 0.5, 9e16);
  const expectedForce = 6.674e-11 * 1 * 2;
  expect(result.totalForce).toBeCloseTo(expectedForce);
  expect(result.curvatureEffect).toBeCloseTo(expectedForce * 0.5);
  expect(result.massFromEnergy).toBeCloseTo(1);
});
