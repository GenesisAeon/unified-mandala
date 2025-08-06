import { JavaHamsterFlow } from '../JavaHamsterAI';

describe('JavaHamsterFlow', () => {
  it('coaches and awards sigil after all levels solved', () => {
    const flow = new JavaHamsterFlow([
      { id: 'l1', hint: 'Use move();' },
      { id: 'l2', hint: 'Try turnLeft();' },
    ]);

    // Coach provides hints
    expect(flow.coach('l1')).toBe('Use move();');
    expect(flow.awardSigil()).toBeNull();

    // Solve levels sequentially
    flow.solve('l1');
    expect(flow.rewardReady()).toBe(false);
    flow.solve('l2');

    // After solving all levels a sigil is awarded
    expect(flow.rewardReady()).toBe(true);
    const sigil = flow.awardSigil();
    expect(sigil).toMatch(/sigil-l1-l2/);

    // Subsequent calls return the same sigil
    expect(flow.awardSigil()).toBe(sigil);
  });
});
