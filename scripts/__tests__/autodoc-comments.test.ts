import fs from 'fs';
import path from 'path';
import { extractComments, generateDocs } from '../autodoc-comments';

test('extractComments returns JSDoc blocks', () => {
  const tmp = path.join(__dirname, '__tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const tsFile = path.join(tmp, 'sample.ts');
  fs.writeFileSync(tsFile, '/** Example comment */\nexport const x = 42;');

  const blocks = extractComments(tsFile);
  expect(blocks[0]).toContain('Example comment');

  const outDir = path.join(tmp, 'docs');
  const map = generateDocs([tsFile], outDir);
  const outFile = path.join(outDir, 'sample.md');
  expect(fs.existsSync(outFile)).toBe(true);
  expect(map[tsFile]).toBe(outFile);

  fs.rmSync(tmp, { recursive: true, force: true });
});
