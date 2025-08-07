import { generateCurvatureMap, generateGalaxyMap, simulateDarkMatterDistribution } from './NullfeldVisualization';

test('inverts curvature values', () => {
  expect(generateCurvatureMap([1, -2])).toEqual([-1, 2]);
});

test('creates galaxy map identifiers', () => {
  expect(generateGalaxyMap(2)).toEqual(['Galaxy-0', 'Galaxy-1']);
});

test('estimates dark matter distribution', () => {
  expect(simulateDarkMatterDistribution(100)).toBeCloseTo(27);
});
