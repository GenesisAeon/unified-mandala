import { shadowIntegration } from './index';

test('shadowIntegration returns module string', () => {
  expect(shadowIntegration()).toBe('shadow-integration module');
});
