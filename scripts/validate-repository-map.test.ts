import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { validateRepositoryMap } from './validate-repository-map';

describe('validateRepositoryMap', () => {
  it('validates the default repository map', () => {
    const file = path.join(__dirname, '../repositorypflege/repository_map.yaml');
    expect(() => validateRepositoryMap(file)).not.toThrow();
  });

  it('throws on missing required fields', () => {
    const tmp = path.join(os.tmpdir(), 'bad_repo_map.yaml');
    fs.writeFileSync(tmp, 'repository_map:\n  - name: test\n    type: t\n    role: r\n');
    expect(() => validateRepositoryMap(tmp)).toThrow(/modules/);
  });
});
