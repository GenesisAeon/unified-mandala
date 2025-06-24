import fs from 'fs';
import path from 'path';
import { AeonMemory } from '../core/AeonMemory';
import { AeonSigillinVault } from '../core/AeonSigillinVault';
import { Task } from '../core/interfaces';

export interface CompileResult {
  tasks: Task[];
}

export interface CompileOptions {
  baseDir?: string;
  visited?: Set<string>;
}

export function compile(source: string, options: CompileOptions = {}): CompileResult {
  AeonMemory.load();
  const tasks: Task[] = [];
  const baseDir = options.baseDir || process.cwd();
  const visited = options.visited || new Set<string>();

  source.split(/\n+/).forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const [cmd, ...rest] = trimmed.split(' ');
    const content = rest.join(' ');

    if (cmd.toUpperCase() === 'REM') {
      AeonMemory.record(content);
    } else if (cmd.toUpperCase() === 'SIG' || cmd.toUpperCase() === 'SIGILLIN') {
      AeonSigillinVault.record({ id: `${idx}`, timestamp: new Date().toISOString(), content });
    } else if (cmd.toUpperCase() === 'TASK') {
      tasks.push({ id: `${idx}`, description: content });
    } else if (cmd.toUpperCase() === 'INCLUDE') {
      const filePath = path.resolve(baseDir, content);
      if (!visited.has(filePath) && fs.existsSync(filePath)) {
        visited.add(filePath);
        const childSource = fs.readFileSync(filePath, 'utf-8');
        const child = compile(childSource, { baseDir: path.dirname(filePath), visited });
        tasks.push(...child.tasks);
      }
    }
  });

  return { tasks };
}
