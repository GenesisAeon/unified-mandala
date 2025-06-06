import fs from 'fs';
import path from 'path';

export class BackupManager {
  constructor(private dest = '.backup') {
    if (!fs.existsSync(this.dest)) fs.mkdirSync(this.dest, { recursive: true });
  }

  backupFile(file: string) {
    const base = path.basename(file);
    const target = path.join(this.dest, base);
    fs.copyFileSync(file, target);
  }
}
