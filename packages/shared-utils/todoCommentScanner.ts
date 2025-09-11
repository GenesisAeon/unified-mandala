import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

export function scanTodoComments(text: string): string[] {
  const regex = /TODO[:\s](.*)/g;
  const matches: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

export interface TodoComment {
  file: string;
  line: number;
  text: string;
}

export function scanTodoCommentsInDir(dir: string): TodoComment[] {
  const patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
  const files = globSync(`{${patterns.join(',')}}`, {
    cwd: dir,
    ignore: ['node_modules/**', '**/node_modules/**', '**/dist/**'],
  });
  const todos: TodoComment[] = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      const m = line.match(/^\s*(?:\/\/|#)\s*TODO[:\s](.*)/);
      if (m) {
        todos.push({ file: fullPath, line: idx + 1, text: m[1].trim() });
      }
    });
  }
  return todos;
}
