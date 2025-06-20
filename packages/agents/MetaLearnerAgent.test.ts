import { MetaLearnerAgent } from './MetaLearnerAgent';

describe('MetaLearnerAgent', () => {
  it('calculates average score', () => {
    const agent = new MetaLearnerAgent();
    expect(agent.analyze([1,2,3])).toBe(2);
  });
});
