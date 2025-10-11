import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { findMissingModules } from './repository-map-check-modules';

describe('findMissingModules', () => {
  it('returns empty array when all modules exist', () => {
    const tmp = path.join(os.tmpdir(), 'repo_map_valid.yaml');
    const content = {
      repository_map: [{ name: 'test', type: 't', role: 'r', modules: ['AGENTS.md'] }],
    };
    fs.writeFileSync(tmp, yaml.dump(content));
    expect(findMissingModules(tmp)).toEqual([]);
  });

  it('lists missing modules', () => {
    const tmp = path.join(os.tmpdir(), 'repo_map_missing.yaml');
    const content = {
      repository_map: [{ name: 'test', type: 't', role: 'r', modules: ['not_there.file'] }],
    };
    fs.writeFileSync(tmp, yaml.dump(content));
    expect(findMissingModules(tmp)).toEqual(['not_there.file']);
  });
});
