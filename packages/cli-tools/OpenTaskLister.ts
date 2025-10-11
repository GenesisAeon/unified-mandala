import fs from 'fs';
import YAML from 'yaml';

export interface AdvancedTodoEntry {
  commit: string;
  path: string;
  task: string;
  test?: string;
  status?: string;
}

export function loadAdvancedTodo(file: string): AdvancedTodoEntry[] {
  try {
    const data = fs.readFileSync(file, 'utf8');
    const list = YAML.parse(data);
    return Array.isArray(list) ? (list as AdvancedTodoEntry[]) : [];
  } catch {
    return [];
  }
}

export function getOpenTasks(file: string): AdvancedTodoEntry[] {
  return loadAdvancedTodo(file).filter((t) => t.status === 'todo');
}
