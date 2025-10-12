import { existsSync } from 'node:fs';

test('pantheon deployment config exists', () => {
  expect(existsSync('deployment/pantheon/deployment.yaml')).toBe(true);
});
