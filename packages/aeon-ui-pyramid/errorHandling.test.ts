import { logError } from './errorHandling';

test('logError returns event with message', () => {
  const evt = logError('test');
  expect(evt.message).toBe('test');
  expect(typeof evt.timestamp).toBe('number');
});
