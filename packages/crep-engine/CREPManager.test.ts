import fs from 'fs';
import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

const file = 'crepHistory.json';

describe('CREPManager with localStorage', () => {
  beforeEach(() => {
    (globalThis as any).localStorage = {
      store: {} as Record<string, string>,
      getItem(key: string) { return this.store[key] || null; },
      setItem(key: string, value: string) { this.store[key] = value; },
      clear() { this.store = {}; }
    };
    (globalThis as any).localStorage.clear();
    jest.spyOn(GPTEventHub, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds entry and emits update', () => {
    const manager = new CREPManager();
    manager.addCREPEntry(1, 2, 3, 4);
    expect(manager.getCREPHistory()).toHaveLength(1);
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0][0]).toBe('crep:updated');
    expect((globalThis as any).localStorage.getItem('crepHistory')).not.toBeNull();
  });

  it('loads history from localStorage', () => {
    const ts = new Date().toISOString();
    (globalThis as any).localStorage.setItem('crepHistory', JSON.stringify([{ timestamp: ts, C: 1, R: 1, E: 1, P: 1 }]));
    const manager = new CREPManager();
    expect(manager.getCREPHistory()).toHaveLength(1);
  });
});

describe('CREPManager without localStorage', () => {
  beforeEach(async () => {
    delete (globalThis as any).localStorage;
    try { await fs.promises.unlink(file); } catch {}
    jest.spyOn(GPTEventHub, 'emit');
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    try { await fs.promises.unlink(file); } catch {}
  });

  it('writes history to file when no localStorage', async () => {
    const manager = new CREPManager();
    await manager.addCREPEntry(1, 1, 1, 1);
    await new Promise((r) => setTimeout(r, 10));
    const data = JSON.parse(await fs.promises.readFile(file, 'utf8'));
    expect(data).toHaveLength(1);
  });

  it('loads history from file', async () => {
    const ts = new Date().toISOString();
    await fs.promises.writeFile(file, JSON.stringify([{ timestamp: ts, C: 1, R: 1, E: 1, P: 1 }]));
    const manager = new CREPManager();
    await new Promise((r) => setTimeout(r, 10));
    expect(manager.getCREPHistory()).toHaveLength(1);
  });
});
