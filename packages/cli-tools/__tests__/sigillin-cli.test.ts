import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('grep-todos command', () => {
  const tmpDir = path.join(__dirname, '__tmp__');
  const sample = path.join(tmpDir, 'conv.json');

  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    fs.writeFileSync(sample, JSON.stringify([{text:'hi'},{text:'TODO: do'}]));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('extracts TODO items', () => {
    const cli = path.resolve(__dirname, '..', 'sigillin-cli.js');
    execSync(`npx ts-node ${cli} grep-todos -i ${sample} -o ${tmpDir}`);
    const out = JSON.parse(fs.readFileSync(path.join(tmpDir, 'conv-grep.json'), 'utf8'));
    expect(out.length).toBe(1);
    expect(out[0].text).toContain('TODO');
  });
});
