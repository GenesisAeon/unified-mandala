import fs from 'fs';
import path from 'path';
import { extractCodeSnippetsFromFile } from './jsonFragmenter';

describe('extractCodeSnippetsFromFile', () => {
  const tmpDir = path.join(__dirname, '__sniptmp__');
  const sampleFile = path.join(tmpDir, 'sample.json');

  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const sample = [
      { msg: "Here is code:\n```js\nconsole.log('hi');\n```" },
      { msg: "no code here" },
      { msg: "Another snippet:\n```python\nprint('x')\n```" }
    ];
    fs.writeFileSync(sampleFile, JSON.stringify(sample), 'utf8');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('extracts snippets and writes files', () => {
    const outDir = path.join(tmpDir, 'out');
    const snippets = extractCodeSnippetsFromFile(sampleFile, outDir);
    expect(snippets.length).toBe(2);
    expect(snippets[0]).toContain("console.log('hi');");
    const files = fs.readdirSync(outDir);
    expect(files.length).toBe(2);
  });
});
