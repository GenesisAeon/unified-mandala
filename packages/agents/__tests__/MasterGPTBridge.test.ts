import { describe, it, expect } from 'vitest';
import { MasterGPTBridge } from '../MasterGPTBridge';

describe('MasterGPTBridge', () => {
  it('registers and lists teams', () => {
    const bridge = new MasterGPTBridge();
    bridge.registerTeam({ name: 'alpha', members: ['a', 'b'] });
    bridge.registerTeam({ name: 'beta', members: [] });
    expect(bridge.listTeams()).toEqual(['alpha', 'beta']);
  });

  it('broadcasts messages to all teams', () => {
    const bridge = new MasterGPTBridge();
    bridge.registerTeam({ name: 'alpha', members: [] });
    bridge.registerTeam({ name: 'beta', members: [] });
    const msgs = bridge.broadcast('hello');
    expect(msgs).toEqual(['[alpha] hello', '[beta] hello']);
  });
});
