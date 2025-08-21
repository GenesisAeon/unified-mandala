import fs from 'fs';
import path from 'path';
import os from 'os';
const { parseNewAdvancedConversations } = require('../parse-newadvanced-conversations');

test('parseNewAdvancedConversations writes YAML when enabled', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-test-'));
  const input = path.join(tmp, 'input.json');
  const conversations = [{ text: 'Hello TODO world' }, { text: 'no match' }];
  fs.writeFileSync(input, JSON.stringify(conversations));
  const dest = path.join(tmp, 'out');
  const matches = parseNewAdvancedConversations(input, dest, 'TODO', { writeYaml: true });
  expect(matches).toHaveLength(1);
  const base = path.join(dest, 'input-grep');
  expect(fs.existsSync(`${base}.json`)).toBe(true);
  expect(fs.existsSync(`${base}.yaml`)).toBe(true);
});
