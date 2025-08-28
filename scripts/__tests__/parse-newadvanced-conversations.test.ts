import fs from 'fs';
import path from 'path';
import os from 'os';
import { test, expect } from 'vitest';
const {
  parseNewAdvancedConversations,
  chunkNewAdvancedConversations,
} = require('../parse-newadvanced-conversations');

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

test('chunkNewAdvancedConversations splits file into chunks', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chunk-'));
  const input = path.join(tmp, 'input.json');
  const data = Array.from({ length: 5 }, (_, i) => ({ id: i }));
  fs.writeFileSync(input, JSON.stringify(data));
  const dest = path.join(tmp, 'out');
  await chunkNewAdvancedConversations(input, dest, 2);
  const files = fs.readdirSync(dest).sort();
  expect(files).toEqual(['input-1.json', 'input-2.json', 'input-3.json']);
  const first = JSON.parse(fs.readFileSync(path.join(dest, 'input-1.json'), 'utf8'));
  expect(first).toEqual([{ id: 0 }, { id: 1 }]);
});

test('parseNewAdvancedConversations honors start and count', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-start-'));
  const fixture = path.join(__dirname, '../../tests/fixtures/newadvanced-multi.json');
  const dest = path.join(tmp, 'out');
  const matches = await parseNewAdvancedConversations(fixture, dest, 'TODO', {
    stream: true,
    start: 1,
    count: 1,
  });
  expect(matches).toHaveLength(0);
});
