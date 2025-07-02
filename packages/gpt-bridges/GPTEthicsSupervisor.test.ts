import { isEthical } from './GPTEthicsSupervisor';

test('detects banned words', () => {
  expect(isEthical('hello bad', ['bad'])).toBe(false);
  expect(isEthical('hello', ['bad'])).toBe(true);
});
