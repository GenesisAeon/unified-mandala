import fs from 'fs';

export interface TodoItem {
  text: string;
  done: boolean;
}

export function extractTodos(text: string): TodoItem[] {
  const tasks: TodoItem[] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\* \[( |x)\] (.+)$/);
    if (m) tasks.push({ text: m[2].trim(), done: m[1] === 'x' });
  }
  return tasks;
}

export function extractTodosFromFile(filePath: string): TodoItem[] {
  const content = fs.readFileSync(filePath, 'utf8');
  return extractTodos(content);
}
