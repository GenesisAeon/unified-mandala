import fs from 'fs';
import path from 'path';
import { test, expect } from 'vitest';
import { ZIPMEMManagementAgent, Fragment } from './ZIPMEMManagementAgent';

test('organize writes fragments', () => {
  const dir = path.join(__dirname, '__zip');
  const agent = new ZIPMEMManagementAgent(dir);
  const fragments: Fragment[] = [{ id: 'f1', content: { text: 'hello' } }];
  agent.organize(fragments);
  expect(fs.existsSync(path.join(dir, 'f1', 'fragment.json'))).toBe(true);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('detectLinks finds ids', () => {
  const agent = new ZIPMEMManagementAgent();
  const frags: Fragment[] = [{ id: 'a', content: { ref: 'see 12345678-aaaa-bbbb-cccc-123456789abc' } }];
  const links = agent.detectLinks(frags);
  expect(links['a'][0]).toBe('12345678-aaaa-bbbb-cccc-123456789abc');
});
