import { promises as fs } from 'fs';
import { resolve } from 'path';

const LEDGER_PATH = resolve(__dirname, '../../data/dataset_ledger.jsonl');

export interface LedgerEntry {
  sha256: string;
  url: string;
  domain: string;
  license: string;
  spdxId: string;
  tosSnapshotUrl?: string;
  acquiredAt: string;
  jurisdiction: string;
}

export async function writeLedger(entry: LedgerEntry): Promise<void> {
  const line = JSON.stringify(entry) + '\n';
  await fs.appendFile(LEDGER_PATH, line, { encoding: 'utf-8' });
}
