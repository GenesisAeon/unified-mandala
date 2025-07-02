import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GenesisAeonNavigator } from './GenesisAeonNavigator';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('GenesisAeonNavigator', () => {
  const tmp = path.join(__dirname, 'phaseMap.test.json');
  const map = { init: 'phase1' };
  beforeAll(() => {
    fs.writeFileSync(tmp, JSON.stringify(map));
  });
  afterAll(() => {
    fs.unlinkSync(tmp);
  });

  beforeEach(() => {
    vi.spyOn(GPTEventHub, 'emit');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates and emits event', () => {
    const nav = new GenesisAeonNavigator({ phaseMapPath: tmp });
    nav.navigate('init');
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0]).toEqual([
      'genesis:navigate',
      { from: 'init', to: 'phase1' }
    ]);
  });

  it('updates phase map', () => {
    const nav = new GenesisAeonNavigator({ phaseMapPath: tmp });
    nav.updatePhaseMap({ a: 'b' });
    nav.navigate('a');
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0][1]).toEqual({
      from: 'a',
      to: 'b'
    });
  });

  it('handles missing phase map gracefully', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const nav = new GenesisAeonNavigator({ phaseMapPath: 'nope.json' });
    nav.navigate('init');
    expect((console.error as jest.Mock).mock.calls.length).toBeGreaterThan(0);
    expect((GPTEventHub.emit as jest.Mock).mock.calls.length).toBe(0);
    (console.error as jest.Mock).mockRestore();
  });
});
