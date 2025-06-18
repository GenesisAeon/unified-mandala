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
    jest.spyOn(GPTEventHub, 'emit');
  });
  afterEach(() => {
    jest.restoreAllMocks();
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
});
