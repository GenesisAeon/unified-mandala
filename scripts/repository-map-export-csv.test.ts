import { describe, it, expect } from 'vitest';
import { exportRepositoryMapCSV } from './repository-map-export-csv';

describe('exportRepositoryMapCSV', () => {
  it('generates CSV with header', () => {
    const csv = exportRepositoryMapCSV();
    const lines = csv.trim().split('\n');
    expect(lines[0]).toBe('"repository","module"');
    expect(lines.length).toBeGreaterThan(1);
  });
});
