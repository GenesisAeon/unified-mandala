import { parseCREP } from '../chronopoem-committer';

test('parseCREP extracts values from poem', () => {
  const poem = 'CREP-Strahl: 0.1, 0.2, 0.3, 0.4 - test';
  expect(parseCREP(poem)).toBe('0.1, 0.2, 0.3, 0.4');
});
