import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exportRepositoryMap } from './repository-map-export';

describe('exportRepositoryMap', () => {
  it('returns repository map object', () => {
    const data = exportRepositoryMap();
    expect(data).toHaveProperty('repository_map');
  });

  it('writes JSON to file when outFile is provided', () => {
    const tmp = path.join(os.tmpdir(), 'repo_map_export.json');
    exportRepositoryMap(undefined, tmp);
    const written = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    expect(written).toHaveProperty('repository_map');
    fs.unlinkSync(tmp);
  });
});
