import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('dataset ledger', () => {
  const ledgerPath = path.resolve(__dirname, '../data/dataset_ledger.jsonl');
  it('has entries with required fields', () => {
    const content = fs.readFileSync(ledgerPath, 'utf-8').trim().split('\n');
    expect(content.length).greaterThan(0);
    for (const line of content) {
      const entry = JSON.parse(line);
      expect(entry).toHaveProperty('sha256');
      expect(entry).toHaveProperty('license');
      expect(entry).toHaveProperty('spdxId');
      expect(entry.license).not.toBe('');
      expect(entry.spdxId).not.toBe('');
    }
  });
});
