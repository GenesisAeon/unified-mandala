import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateTodoFromConvos } from '../generate-todo-from-convos';

describe('generateTodoFromConvos', () => {
  it('creates todo yaml from conversations', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'convos-'));
    const convPath = path.join(tmpDir, 'conv.json');
    const outPath = path.join(tmpDir, 'todo.yaml');
    const conv = [
      {
        id: '1',
        mapping: {
          n1: {
            message: {
              author: { role: 'user' },
              content: { parts: ['wir sollten eine neue Funktion bauen'] },
            },
          },
        },
      },
    ];
    fs.writeFileSync(convPath, JSON.stringify(conv));
    generateTodoFromConvos(convPath, outPath);
    const yaml = fs.readFileSync(outPath, 'utf8');
    expect(yaml).toContain('eine neue Funktion bauen');
  });
});
