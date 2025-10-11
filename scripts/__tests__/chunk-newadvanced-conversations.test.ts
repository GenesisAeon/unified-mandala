import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const { chunkNewAdvancedConversations } = require('../parse-newadvanced-conversations');

describe('chunkNewAdvancedConversations', () => {
  const file = path.join(__dirname, 'fixtures/newadvancedconversations-small.json');
  let dest: string;

  beforeEach(() => {
    dest = fs.mkdtempSync(path.join(os.tmpdir(), 'chunk-'));
  });

  afterEach(() => {
    fs.rmSync(dest, { recursive: true, force: true });
  });

  it('writes chunk files with requested size', async () => {
    await chunkNewAdvancedConversations(file, dest, 1);
    const chunks = fs.readdirSync(dest).filter((f) => f.endsWith('.json'));
    expect(chunks).toHaveLength(2);
    const first = JSON.parse(fs.readFileSync(path.join(dest, chunks[0]), 'utf8'));
    expect(first).toHaveLength(1);
  });
});
