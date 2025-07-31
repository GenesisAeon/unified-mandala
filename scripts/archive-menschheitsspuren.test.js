import { appendEntry } from './archive-menschheitsspuren.js';
import fs from 'fs';
import path from 'path';
import { describe, it, expect, afterEach } from 'vitest';

const ARCHIVE_PATH = path.join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md');

describe('archive-menschheitsspuren', () => {
  afterEach(() => {
    // remove last line for test isolation
    const lines = fs.readFileSync(ARCHIVE_PATH, 'utf-8').trim().split('\n');
    lines.pop();
    fs.writeFileSync(ARCHIVE_PATH, lines.join('\n') + '\n');
  });

  it('appends entry to archive file', () => {
    const entry = 'Testfund 1000 BP';
    appendEntry(entry);
    const content = fs.readFileSync(ARCHIVE_PATH, 'utf-8');
    expect(content).toMatch(entry);
  });
});
