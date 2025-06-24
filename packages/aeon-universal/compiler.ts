import { AeonMemory } from '../core/AeonMemory';
import { Task } from '../core/interfaces';

export interface CompileResult {
  tasks: Task[];
}

export function compile(source: string): CompileResult {
  AeonMemory.load();
  const tasks: Task[] = [];
  source.split(/\n+/).forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const [cmd, ...rest] = trimmed.split(' ');
    const content = rest.join(' ');
    if (cmd.toUpperCase() === 'REM') {
      AeonMemory.record(content);
    } else if (cmd.toUpperCase() === 'TASK') {
      tasks.push({ id: `${idx}`, description: content });
    }
  });
  return { tasks };
}
