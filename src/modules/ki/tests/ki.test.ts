import { describe, it, expect } from 'vitest';
import BayesDesigner from '../BayesDesigner';
import RLCSOAgent from '../RLCSOAgent';
import evolveGreen from '../evolve_green';
import * as index from '../index';

describe('KI modules', () => {
  it('BayesDesigner.suggest returns posterior', () => {
    const b = new BayesDesigner();
    const p = b.suggest(0.5, 0.8);
    expect(p).toBeGreaterThan(0.5);
    expect(p).toBeLessThan(1);
  });

  it('RLCSOAgent selects best action and updates Q', () => {
    const agent = new RLCSOAgent();
    const state = 's';
    const actions = ['a', 'b'];
    // initial: both equal, returns first
    expect(agent.selectAction(state, actions)).toBe('a');
    // update b with positive reward, then select again
    agent.update(state, 'b', 1);
    const pick = agent.selectAction(state, actions);
    expect(pick).toBe('b');
  });

  it('evolveGreen filters options containing green (case-insensitive)', () => {
    const out = evolveGreen(['Blue', 'GreenLeaf', 'evergreen', 'red']);
    expect(out).toEqual(['GreenLeaf', 'evergreen']);
  });

  it('index barrel re-exports symbols', () => {
    expect(typeof index.evolveGreen).toBe('function');
    expect(typeof (index as any).RLCSOAgent).toBe('function');
    expect(typeof (index as any).BayesDesigner).toBe('function');
  });
});
