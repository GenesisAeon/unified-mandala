import { env } from './config';

test('loads environment variables', () => {
  expect(env).toBeDefined();
});
