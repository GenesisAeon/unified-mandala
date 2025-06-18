import { CodexProjectInitAgent } from './CodexProjectInitAgent';

describe('CodexProjectInitAgent', () => {
  it('adds and lists projects', () => {
    const agent = new CodexProjectInitAgent();
    agent.addProject('alpha');
    agent.addProject('beta');
    expect(agent.list()).toEqual(['alpha', 'beta']);
    expect(agent.removeProject('alpha')).toBe(true);
    expect(agent.list()).toEqual(['beta']);
    expect(agent.removeProject('gamma')).toBe(false);
  });
});
