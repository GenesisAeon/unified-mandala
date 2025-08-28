import fs from 'fs';
import path from 'path';
import os from 'os';
const { parseNewAdvancedConversations } = require('../parse-newadvanced-conversations');

test('parseNewAdvancedConversations writes YAML when enabled', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-test-'));
  const input = path.join(tmp, 'input.json');
  const conversations = [{ text: 'Hello TODO world' }, { text: 'no match' }];
  fs.writeFileSync(input, JSON.stringify(conversations));
  const dest = path.join(tmp, 'out');
  const matches = await parseNewAdvancedConversations(input, dest, 'TODO', { writeYaml: true });
  expect(matches).toHaveLength(1);
  const base = path.join(dest, 'input-grep');
  expect(fs.existsSync(`${base}.json`)).toBe(true);
  expect(fs.existsSync(`${base}.yaml`)).toBe(true);
});

test('parseNewAdvancedConversations streams when requested', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-stream-'));
  const fixture = path.join(__dirname, '../../tests/fixtures/newadvanced-sample.json');
  const dest = path.join(tmp, 'out');
  const matches = await parseNewAdvancedConversations(fixture, dest, 'TODO', { stream: true });
  expect(matches).toHaveLength(1);
  const base = path.join(dest, 'newadvanced-sample-grep');
  expect(fs.existsSync(`${base}.json`)).toBe(true);
});
