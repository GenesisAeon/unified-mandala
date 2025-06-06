import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('CREPManager', () => {
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

  it('calculates average CREP values', () => {
    const manager = new CREPManager();
    manager.addCREPEntry(2, 4, 6, 8);
    manager.addCREPEntry(4, 6, 8, 10);
    const avg = manager.getAverageCREP();
    expect(avg.C).toBe(3);
    expect(avg.R).toBe(5);
    expect(avg.E).toBe(7);
    expect(avg.P).toBe(9);
  });
});
