import fs from 'fs';
import path from 'path';
import { test, expect } from 'vitest';
import { validateNewAdvancedConversations } from '../validate-newadvanced-conversations';

test('detects duplicates and missing fields', () => {
  const tmp = fs.mkdtempSync(path.join(__dirname, 'val-'));
  const file = path.join(tmp, 'conv.json');
  fs.writeFileSync(
    file,
    JSON.stringify([
      { id: '1', title: 'A', mapping: {} },
      { id: '1', mapping: {} },
      { title: 'C', mapping: {} }
    ])
  );
  const res = validateNewAdvancedConversations(file);
  expect(res.conversationCount).toBe(3);
  expect(res.duplicateIds).toEqual(['1']);
  expect(res.missingFields.length).toBe(2);
  fs.rmSync(tmp, { recursive: true, force: true });
});
