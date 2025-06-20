import fs from 'fs';
import { CREPManager } from '../crep-engine/CREPManager';
import { writeDailySnapshot } from './CREPChronoMonitor';

test('writes snapshot file', () => {
  const mgr = new CREPManager();
  mgr.addCREPEntry(1,2,3,4);
  writeDailySnapshot(mgr, '.');
  const date = new Date().toISOString().split('T')[0];
  const file = `CREP_SNAPSHOT_${date}.json`;
  expect(fs.existsSync(file)).toBe(true);
  fs.unlinkSync(file);
});
