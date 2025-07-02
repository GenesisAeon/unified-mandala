import { checkIntegrity } from './SigillinIntegrityChecker';

test('checks for sigil keyword', () => {
  expect(checkIntegrity('mysigil')).toBe(true);
  expect(checkIntegrity('other')).toBe(false);
});
