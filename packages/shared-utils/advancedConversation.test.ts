import fs from 'fs';
import path from 'path';
import { extractMessagesAfterAnchor } from './advancedConversation';

describe('extractMessagesAfterAnchor', () => {
  const tmp = path.join(__dirname, '__tmp_anchor.json');
  beforeAll(() => {
    const conv = [
      {
        id: 'c1',
        mapping: {
          root: {
            id: 'root',
            message: {
              id: 'm1',
              author: { role: 'user' },
              create_time: 1,
              content: { parts: ['Hallo'] },
            },
            parent: null,
            children: ['a'],
          },
          a: {
            id: 'a',
            message: {
              id: 'm2',
              author: { role: 'user' },
              create_time: 2,
              content: { parts: ['siehe codex-sigil.yaml'] },
            },
            parent: 'root',
            children: ['b'],
          },
          b: {
            id: 'b',
            message: {
              id: 'm3',
              author: { role: 'assistant' },
              create_time: 3,
              content: { parts: ['task 1'] },
            },
            parent: 'a',
            children: [],
          },
        },
      },
    ];
    fs.writeFileSync(tmp, JSON.stringify(conv), 'utf8');
  });
  afterAll(() => {
    fs.unlinkSync(tmp);
  });

  it('extracts messages after anchor', () => {
    const msgs = extractMessagesAfterAnchor(tmp, 'codex-sigil.yaml');
    expect(msgs).toEqual(['task 1']);
  });
});
