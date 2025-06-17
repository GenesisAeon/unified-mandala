import { CodexProjectInitAgent } from './CodexProjectInitAgent';

describe('CodexProjectInitAgent', () => {
  it('adds and lists projects', () => {
    const agent = new CodexProjectInitAgent();
    agent.addProject('alpha');
    agent.addProject('beta');
    expect(agent.list()).toEqual(['alpha', 'beta']);
  });
});
