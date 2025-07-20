import fs from 'fs';
import path from 'path';

export function archiveTodos(src = 'advancedToDo.json', archiveDir = 'GenesisAeonZIPMEM') {
  if (!fs.existsSync(src)) return 'archived';
  const data = JSON.parse(fs.readFileSync(src, 'utf-8')) as any[];
  const remaining = [] as any[];
  const archived = [] as any[];
  for (const item of data) {
    if (item.status === 'done') {
      archived.push(item);
    } else {
      remaining.push(item);
    }
  }
  fs.mkdirSync(archiveDir, { recursive: true });
  const archivePath = path.join(archiveDir, 'archived_todos.json');
  const prev = fs.existsSync(archivePath) ? JSON.parse(fs.readFileSync(archivePath, 'utf-8')) : [];
  fs.writeFileSync(archivePath, JSON.stringify([...prev, ...archived], null, 2));
  fs.writeFileSync(src, JSON.stringify(remaining, null, 2));
  return 'archived';
}

if (require.main === module) {
  console.log(archiveTodos());
}
