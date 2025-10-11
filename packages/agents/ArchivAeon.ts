import fs from 'fs';
import path from 'path';

export interface ArchiveEntry {
  id: string;
  conversation: any;
}

export class ArchivAeon {
  constructor(private baseDir = 'GenesisAeonZIPMEM/commitMemory') {}

  archive(entries: ArchiveEntry[]): number {
    entries.forEach((e) => {
      const dir = path.join(this.baseDir, e.id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'conversation.json'),
        JSON.stringify(e.conversation, null, 2),
      );
    });
    return entries.length;
  }
}
