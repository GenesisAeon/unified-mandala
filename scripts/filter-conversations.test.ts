import { describe, it, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { filterConversations } from './filter-conversations';

describe('filterConversations', () => {
  const tmpFile = path.join(__dirname, 'tmp-conversations.json');
  const sample = [
    { id: 1, text: 'Hello world' },
    { id: 2, text: 'Another entry' },
    { id: 3, text: 'world of code' },
  ];
  fs.writeFileSync(tmpFile, JSON.stringify(sample), 'utf8');

  it('filters entries containing keyword', () => {
    const result = filterConversations({ keyword: 'world', file: tmpFile });
    expect(result).toHaveLength(2);
  });

  afterAll(() => {
    fs.unlinkSync(tmpFile);
  });
});
