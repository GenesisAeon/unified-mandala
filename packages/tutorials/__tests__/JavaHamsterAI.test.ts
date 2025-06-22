import { JavaHamsterFlow } from '../JavaHamsterAI';

describe('JavaHamsterFlow', () => {
  it('rewards after solving all levels', () => {
    const flow = new JavaHamsterFlow(['l1', 'l2']);
    expect(flow.rewardReady()).toBe(false);
    flow.solve('l1');
    expect(flow.rewardReady()).toBe(false);
    flow.solve('l2');
    expect(flow.rewardReady()).toBe(true);
  });
});
