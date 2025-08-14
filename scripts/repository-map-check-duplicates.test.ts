import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { findDuplicates } from './repository-map-check-duplicates';

describe('findDuplicates', () => {
  it('returns empty arrays when no duplicates', () => {
    const tmp = path.join(os.tmpdir(), 'repo_map_unique.yaml');
    const content = {
      repository_map: [
        { name: 'a', modules: ['m1', 'm2'] },
        { name: 'b', modules: ['m3'] },
      ],
    };
    fs.writeFileSync(tmp, yaml.dump(content));
    expect(findDuplicates(tmp)).toEqual({ duplicateRepos: [], duplicateModules: [] });
  });

  it('detects duplicate repo names and modules', () => {
    const tmp = path.join(os.tmpdir(), 'repo_map_dupe.yaml');
    const content = {
      repository_map: [
        { name: 'a', modules: ['m1'] },
        { name: 'a', modules: ['m1', 'm2'] },
      ],
    };
    fs.writeFileSync(tmp, yaml.dump(content));
    expect(findDuplicates(tmp)).toEqual({ duplicateRepos: ['a'], duplicateModules: ['m1'] });
  });
});
