import fs from 'fs';
import path from 'path';
import { describe, it, expect, afterEach } from 'vitest';
import { ArchivAeon } from '../ArchivAeon';

const base = path.join(__dirname, '__archiv');

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

describe('ArchivAeon', () => {
  it('archives conversations to commitMemory', () => {
    const agent = new ArchivAeon(base);
    const count = agent.archive([{ id: 'x1', conversation: { a: 1 } }]);
    const file = path.join(base, 'x1', 'conversation.json');
    expect(fs.existsSync(file)).toBe(true);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(data.a).toBe(1);
    expect(count).toBe(1);
  });
});
