import { containsProhibited } from './EthicsLayer';

test('detects prohibited words', () => {
  expect(containsProhibited('inciting violence')).toBe(true);
});

test('passes clean text', () => {
  expect(containsProhibited('hello world')).toBe(false);
});
