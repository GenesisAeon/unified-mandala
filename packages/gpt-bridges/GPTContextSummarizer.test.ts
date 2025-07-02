import { summarize } from './GPTContextSummarizer';

test('summarizes long text', () => {
  const txt = 'a'.repeat(150);
  expect(summarize(txt, 10)).toBe('aaaaaaaaaa...');
});
