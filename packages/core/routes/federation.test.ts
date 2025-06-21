import { push, pull } from './federation';

test('push and pull data', () => {
  push({ a: 1 });
  expect(pull()).toEqual({ a: 1 });
});
