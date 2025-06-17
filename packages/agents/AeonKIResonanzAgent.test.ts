import { AeonKIResonanzAgent } from './AeonKIResonanzAgent';

describe('AeonKIResonanzAgent', () => {
  it('logs messages and emits event', () => {
    const events: any[] = [];
    const agent = new AeonKIResonanzAgent((e, p) => events.push([e, p]));
    agent.start('hello');
    expect(agent.getLog()).toContain('hello');
    expect(events).toEqual([['aeon:resonanz', 'hello']]);
  });
});
