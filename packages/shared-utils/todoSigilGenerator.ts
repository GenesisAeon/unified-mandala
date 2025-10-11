import fs from 'fs';
import { TodoItem, extractTodosFromFile } from './todoParser';

export interface TodoSigilOptions {
  id?: string;
  titel?: string;
  symbolzeit?: string;
}

export function createTodoSigil(tasks: TodoItem[], options: TodoSigilOptions = {}): string {
  const {
    id = 'aeon:2025-0605-TODO',
    titel = 'UnifiedMandala ToDo Übersicht',
    symbolzeit = 'tag',
  } = options;
  const lines: string[] = [];
  lines.push(`sigillin_id: ${id}`);
  lines.push(`symbolzeit: ${symbolzeit}`);
  lines.push(`titel: ${titel}`);
  lines.push('aufgaben:');
  tasks.forEach((t, idx) => {
    lines.push(`  - id: task-${idx + 1}`);
    lines.push(`    beschreibung: "${t.text.replace(/\"/g, '\\"')}"`);
    lines.push(`    status: ${t.done ? 'erledigt' : 'offen'}`);
  });
  return lines.join('\n') + '\n';
}

export function generateTodoSigilFromFile(
  sourcePath: string,
  destPath: string,
  options?: TodoSigilOptions,
) {
  const tasks = extractTodosFromFile(sourcePath);
  const yaml = createTodoSigil(tasks, options);
  fs.writeFileSync(destPath, yaml);
}
