import { expect, test } from 'vitest';
import { EmergencePredictorAgent } from './EmergencePredictorAgent';

test('predict uses linear trend', () => {
  const agent = new EmergencePredictorAgent([1, 2, 3]);
  expect(agent.predict()).toBeCloseTo(4, 5);
});

test('predict handles constant series', () => {
  const agent = new EmergencePredictorAgent([5, 5, 5]);
  expect(agent.predict()).toBeCloseTo(5, 5);
});
