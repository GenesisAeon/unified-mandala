import { startTracing } from './tracing';

test('starts tracing', () => {
  expect(startTracing('test').serviceName).toBe('test');
});
