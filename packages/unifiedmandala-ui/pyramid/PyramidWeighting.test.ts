import { generateWeights, PHI } from './PyramidWeighting';

test('generateWeights returns increasing weights', () => {
  const weights = generateWeights(3);
  expect(weights.length).toBe(3);
  expect(weights[1]).toBeGreaterThan(weights[0]);
  expect(weights[2]).toBeGreaterThan(weights[1]);
});
