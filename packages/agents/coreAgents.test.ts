import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { GenesisAeonNavigator } from './GenesisAeonNavigator';
import { CREPManager } from '../crep-engine/CREPManager';
import { CREPEvaluator } from '../crep-engine/CREPEvaluator';
import { HexaAgentSystem } from './HexaAgentSystem';
import path from 'path';
import fs from 'fs';

const phaseMap = { init: 'next' };
const phaseFile = path.join(__dirname, 'phase.tmp.json');

describe('core agents integration', () => {
  beforeAll(() => {
    fs.writeFileSync(phaseFile, JSON.stringify(phaseMap));
  });

  afterAll(() => {
    fs.unlinkSync(phaseFile);
  });

  it('navigator emits events and evaluator stores entries', () => {
    const nav = new GenesisAeonNavigator({ phaseMapPath: phaseFile });
    const manager = new CREPManager();
    const evaluator = new CREPEvaluator(manager);
    const navSpy = vi.spyOn(nav as any, 'log').mockImplementation(() => {});
    evaluator.evaluateNewDataPoint({ C: 1, R: 1, E: 1, P: 0.1 });
    nav.navigate('init');
    expect(manager.getCREPHistory().length).toBe(1);
    expect(navSpy).toHaveBeenCalled();
  });

  it('hexa agent processes logs', () => {
    const hexa = new HexaAgentSystem();
    const result = hexa.processLogs(['example resonanz']);
    expect(result.profile.count).toBe(1);
  });
});
