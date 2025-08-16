import { PredictiveAnalyticsAgent } from './PredictiveAnalyticsAgent';

test('predicts next value using average delta', () => {
  const agent = new PredictiveAnalyticsAgent();
  expect(agent.predict([1, 2, 3])).toBe(4);
});
