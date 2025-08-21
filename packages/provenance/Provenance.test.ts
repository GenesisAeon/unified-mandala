import { sha256 } from './Provenance';

const expected = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

test('hashes strings and buffers with sha256', () => {
  expect(sha256('test')).toBe(expected);
  const buf = Buffer.from('test');
  expect(sha256(buf)).toBe(expected);
});
