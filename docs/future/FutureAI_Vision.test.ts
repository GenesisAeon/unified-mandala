import fs from 'fs';

test('FutureAI Vision paper exists', () => {
  const text = fs.readFileSync('docs/future/FutureAI_Vision.md', 'utf8');
  expect(text).toMatch(/Future AI Vision/);
});
