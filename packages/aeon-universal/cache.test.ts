import fs from 'fs';
import path from 'path';
import { compile } from './compiler';
import { compileCache } from './cache';

describe('compile cache', () => {
  it('reuses cached result for identical source', () => {
    compileCache.clear();
    const res1 = compile('TASK X');
    const res2 = compile('TASK X');
    expect(res1).toBe(res2);
  });

  it('persists cached result when enabled', () => {
    const dir = path.resolve('.aeoncache');
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    jest.resetModules();
    const { compile: firstCompile } = require('./compiler');
    const { hashSource: hashFn } = require('./cache');
    const hash = hashFn('SIG Hi');
    firstCompile('SIG Hi', { persistentCache: true });
    const file = path.join(dir, `${hash}.json`);
    expect(fs.existsSync(file)).toBe(true);

    jest.resetModules();
    const { compile: secondCompile } = require('./compiler');
    const { AeonSigillinVault: Vault } = require('../core/AeonSigillinVault');
    const result = secondCompile('SIG Hi', { persistentCache: true });
    expect(Vault.latest().length).toBe(0);
    expect(result.tasks.length).toBe(0);
  });
});
