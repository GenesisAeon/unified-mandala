import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { splitNewAdvancedConversations } from './split-newadvanced-conversations';

describe('splitNewAdvancedConversations', () => {
  it('splits conversations into separate files', () => {
    const src = path.join(__dirname, '../tests/fixtures/newadvanced-multi.json');
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'split-convo-'));
    const files = splitNewAdvancedConversations(src, outDir);
    expect(files.length).toBe(2);
    const first = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    expect(first.title).toBe('First');
    const yamlFile = files[0].replace(/\.json$/, '.yaml');
    expect(fs.existsSync(yamlFile)).toBe(true);
  });
});
