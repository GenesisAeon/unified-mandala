import fs from 'fs';
import path from 'path';
import { CREPManager } from '../crep-engine/CREPManager';

export function writeDailySnapshot(manager: CREPManager, dir = '.') {
  const avg = manager.getAverageCREP();
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(dir, `CREP_SNAPSHOT_${date}.json`);
  fs.writeFileSync(file, JSON.stringify(avg, null, 2), 'utf-8');
}
