import { runAutomation } from '../scripts/autoWorkflow';

test('runAutomation runs without error', () => {
  expect(() => runAutomation()).not.toThrow();
});
