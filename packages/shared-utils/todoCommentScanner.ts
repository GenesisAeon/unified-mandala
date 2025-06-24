import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

export interface TodoComment {
  file: string;
  line: number;
  text: string;
}

/**
 * Scans source files under a directory for TODO comments.
 * Supported prefixes: // TODO, # TODO, <!-- TODO -->.
 */
export function scanTodoComments(dir: string): TodoComment[] {
  const patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
  const files = patterns.flatMap(p =>
    globSync(p, {
      cwd: dir,
      absolute: true,
      ignore: ['node_modules/**', 'dist/**', '**/*.test.*']
    })
  );
  const todos: TodoComment[] = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      const m = line.match(/^\s*(?:\/\/|#|<!--)\s*TODO[:]?\s*(.*?)(?:-->.*)?$/);
      if (m) {
        todos.push({ file: path.relative(dir, file), line: idx + 1, text: m[1].trim() });
      }
    });
  }
  return todos;
}
