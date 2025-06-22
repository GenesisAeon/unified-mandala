import { generateReflection } from './index';

test('generates reflection', () => {
  expect(generateReflection('abc')).toBe('Echo: cba');
});
