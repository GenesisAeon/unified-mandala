import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const { parseNewAdvancedConversations } = require('../parse-newadvanced-conversations');

describe('parseNewAdvancedConversations', () => {
  const file = path.join(__dirname, 'fixtures/newadvancedconversations-small.json');
  let dest: string;

  beforeEach(() => {
    dest = fs.mkdtempSync(path.join(os.tmpdir(), 'newadv-'));
  });

  afterEach(() => {
    fs.rmSync(dest, { recursive: true, force: true });
  });

  it('filters sessions and writes grep output', async () => {
    const matches = await parseNewAdvancedConversations(file, dest, 'Session', { stream: false });
    expect(matches).toHaveLength(2);
    const outPath = path.join(dest, 'newadvancedconversations-small-grep.json');
    const written = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(written).toEqual(matches);
  });

  it('writes YAML output when enabled', async () => {
    await parseNewAdvancedConversations(file, dest, 'Session', { stream: false, writeYaml: true });
    const yamlPath = path.join(dest, 'newadvancedconversations-small-grep.yaml');
    const content = fs.readFileSync(yamlPath, 'utf8');
    expect(content).toMatch(/Session A/);
  });

  it('respects start and count in streaming mode', async () => {
    const matches = await parseNewAdvancedConversations(file, dest, 'Session', { stream: true, start: 1, count: 1 });
    expect(matches).toEqual([{ title: 'Session B', mapping: {} }]);
  });
});
