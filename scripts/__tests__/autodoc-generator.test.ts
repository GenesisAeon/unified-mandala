import fs from 'fs';
import path from 'path';
import { generateDocs } from '../autodoc-generator';

test('generates markdown from comments', () => {
  const tmpSrc = path.join(__dirname, '__tmp.ts');
  const outDir = path.join(__dirname, '__out');
  fs.writeFileSync(tmpSrc, `/**\n * Example comment\n * second line\n */\nexport function x() {}`);
  const outFile = generateDocs(tmpSrc, outDir);
  const result = fs.readFileSync(outFile!, 'utf8');
  expect(result).toContain('Example comment');
  fs.rmSync(tmpSrc);
  fs.rmSync(outDir, { recursive: true, force: true });
});
