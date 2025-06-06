import fs from 'fs';

export interface TodoCheckMap {
  [id: string]: () => boolean;
}

export async function updateTodoSigilStatus(filePath: string, checks: TodoCheckMap) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const out: string[] = [];
  let currentId: string | null = null;
  for (let line of lines) {
    const idMatch = line.match(/^\s*- id: (.+)$/);
    if (idMatch) {
      currentId = idMatch[1];
      out.push(line);
      continue;
    }
    if (currentId && line.trim().startsWith('status:')) {
      const check = checks[currentId];
      if (check && check()) {
        line = line.replace(/status:\s+\S+/, 'status: erledigt');
      }
      currentId = null;
    }
    out.push(line);
  }
  fs.writeFileSync(filePath, out.join('\n'));
}
