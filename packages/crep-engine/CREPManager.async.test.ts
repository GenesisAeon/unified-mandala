import fs from 'fs/promises';
import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

const file = 'crepHistory.json';

describe('CREPManager async file operations', () => {
  beforeEach(async () => {
    delete (globalThis as any).localStorage;
    try {
      await fs.unlink(file);
    } catch {}
    jest.spyOn(GPTEventHub, 'emit');
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    try {
      await fs.unlink(file);
    } catch {}
  });

  it('writes and reads asynchronously', async () => {
    const manager = new CREPManager();
    await manager.addCREPEntry(1, 2, 3, 4);
    expect(await fs.readFile(file, 'utf8')).toContain('"C":1');
    const newManager = new CREPManager();
    await new Promise((r) => setTimeout(r, 10));
    expect(newManager.getCREPHistory()).toHaveLength(1);
  });
});
