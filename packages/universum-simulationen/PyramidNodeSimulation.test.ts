import { pyramidNodeSimulation } from './PyramidNodeSimulation';

test('produces increasing energy values', () => {
  const res = pyramidNodeSimulation(3);
  expect(res.length).toBe(3);
  expect(res[1].energy).toBeGreaterThan(res[0].energy);
});
