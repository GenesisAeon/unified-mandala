import fs from 'fs';
import path from 'path';
import { test, expect } from 'vitest';
import { validateNewAdvancedConversations } from '../validate-newadvanced-conversations';

test('detects duplicates, missing fields and invalid roles', () => {
  const tmp = fs.mkdtempSync(path.join(__dirname, 'val-'));
  const file = path.join(tmp, 'conv.json');
  fs.writeFileSync(
    file,
    JSON.stringify([
      { id: '1', title: 'A', mapping: {}, create_time: 1, update_time: 2 },
      { id: '1', mapping: {}, create_time: 1, update_time: 2 },
      { title: 'C', mapping: {}, create_time: 1, update_time: 2 },
      {
        id: '3',
        title: 'Valid mapping but invalid role',
        mapping: {
          node: {
            id: 'node',
            parent: null,
            children: [],
            message: {
              id: 'node',
              author: { role: 'hacker' },
              create_time: 1
            }
          }
        },
        create_time: 1,
        update_time: 2
      }
    ])
  );
  const res = validateNewAdvancedConversations(file);
  expect(res.conversationCount).toBe(4);
  expect(res.duplicateIds).toEqual(['1']);
  expect(res.missingFields.length).toBe(2);
  expect(res.conversationsWithInvalidRoles).toEqual([3]);
  fs.rmSync(tmp, { recursive: true, force: true });
});
