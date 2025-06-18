import { AeonKIResonanzAgent } from './AeonKIResonanzAgent';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('AeonKIResonanzAgent', () => {
  beforeEach(() => {
    jest.spyOn(GPTEventHub, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('logs messages and emits event', () => {
    const events: any[] = [];
    const agent = new AeonKIResonanzAgent((e, p) => events.push([e, p]));
    agent.start('hello');
    expect(agent.getLog()).toContain('hello');
    expect(events).toEqual([['aeon:resonanz', 'hello']]);
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0]).toEqual(['aeon:resonanz', 'hello']);
  });

  it('calculates resonance value', () => {
    const agent = new AeonKIResonanzAgent();
    expect(agent.resonate('abc')).toBe(3);
  });
});
