import { KoKreationInitAgent } from './KoKreationInitAgent';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('KoKreationInitAgent', () => {
  beforeEach(() => {
    jest.spyOn(GPTEventHub, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initializes and logs message', () => {
    const agent = new KoKreationInitAgent();
    agent.init('start');
    expect(agent.isInitialized()).toBe(true);
    expect(agent.getLog()).toContain('start');
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0]).toEqual(['kocreation:init', 'start']);
  });
});
