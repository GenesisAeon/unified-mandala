import fs from 'fs';
import path from 'path';
import generateRepoDocs from '../generate-docs';

describe('generateRepoDocs', () => {
  it('generates docs for given files', () => {
    const tmp = path.join(__dirname, '__tmp_docs');
    const src = path.join(tmp, 'sample.ts');
    fs.mkdirSync(tmp, { recursive: true });
    fs.writeFileSync(src, '/** example */\nexport const x = 1;');
    const out = generateRepoDocs([src], tmp, path.join(tmp, 'manifest.json'));
    const outFile = out[src];
    expect(fs.existsSync(outFile)).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
