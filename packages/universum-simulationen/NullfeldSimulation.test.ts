import { gravitationalForce, membraneCurvature, energyConversion, NullfeldParameters } from './NullfeldSimulation';

test('computes gravitational force', () => {
  const params: NullfeldParameters = { mass1: 1, mass2: 2, distance: 3, membraneEnergy: 0 };
  expect(gravitationalForce(params)).toBeCloseTo(6.674e-11 * 2 / 9);
});

test('computes membrane curvature', () => {
  expect(membraneCurvature(10)).toBe(1);
});

test('converts energy', () => {
  expect(energyConversion(100)).toBe(42);
});
