import { summarize } from './GPTContextSummarizer';

test('summarizes long text without breaking words', () => {
  const txt = 'hello world from unified mandala';
  expect(summarize(txt, 12)).toBe('hello world…');
});

test('returns original text when short enough', () => {
  const txt = 'short text';
  expect(summarize(txt, 50)).toBe(txt);
});
