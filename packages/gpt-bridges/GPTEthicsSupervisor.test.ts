import { isEthical } from './GPTEthicsSupervisor';

test('detects banned words and patterns', () => {
  expect(isEthical('hello BAD', { bannedWords: ['bad'] })).toBe(false);
  expect(isEthical('hello', { bannedWords: ['bad'] })).toBe(true);
  expect(isEthical('promotion of violence', { bannedPatterns: [/violence/i] })).toBe(false);
});
