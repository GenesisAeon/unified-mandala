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
          'client-created-root': {
            id: 'client-created-root',
            parent: null,
            children: ['node'],
            message: null,
          },
          node: {
            id: 'node',
            parent: 'client-created-root',
            children: [],
            message: {
              id: 'node',
              author: { role: 'hacker' },
              create_time: 1,
              update_time: 1,
              content: { content_type: 'text', parts: ['hi'] },
            },
          },
        },
        create_time: 1,
        update_time: 2,
      },
      {
        id: '4',
        title: 'Missing parent reference',
        mapping: {
          node: {
            id: 'node',
            parent: 'ghost',
            children: [],
            message: {
              id: 'node',
              author: { role: 'user' },
              create_time: 1,
            },
          },
        },
        create_time: 1,
        update_time: 2,
      },
      {
        id: '5',
        title: 'Orphan node',
        mapping: {
          'client-created-root': {
            id: 'client-created-root',
            parent: null,
            children: [],
            message: null,
          },
          node: {
            id: 'node',
            parent: null,
            children: [],
            message: {
              id: 'node',
              author: { role: 'user' },
              create_time: 1,
              update_time: 1,
              content: { content_type: 'text', parts: ['hi'] },
            },
          },
        },
        create_time: 1,
        update_time: 2,
      },
    ]),
  );
  const res = validateNewAdvancedConversations(file);
  expect(res.conversationCount).toBe(6);
  expect(res.duplicateIds).toEqual(['1']);
  expect(res.missingFields.length).toBe(6);
  expect(res.conversationsWithInvalidRoles).toEqual([]);
  expect(res.conversationsWithMissingParents).toEqual([4]);
  expect(res.conversationsWithOrphanNodes).toEqual([5]);
  fs.rmSync(tmp, { recursive: true, force: true });
});
