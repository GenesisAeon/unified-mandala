import { EmergencePredictorAgent } from './EmergencePredictorAgent';

test('predict returns average of history', () => {
  const agent = new EmergencePredictorAgent([1, 2, 3]);
  expect(agent.predict()).toBe(2);
});
