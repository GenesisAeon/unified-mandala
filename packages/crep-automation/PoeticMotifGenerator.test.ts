import { generateMotif } from './PoeticMotifGenerator';

test('creates motif from text', () => {
  expect(generateMotif('hello world')).toBe('*hello*');
});
