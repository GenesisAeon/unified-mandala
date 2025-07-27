import { BoundaryLawSimulator } from '../BoundaryLawSimulator';

describe('BoundaryLawSimulator', () => {
  it('evaluates rules', () => {
    const sim = new BoundaryLawSimulator([
      { id: 'r1', evaluate: (i) => typeof i === 'number' && i > 0 },
    ]);
    const result = sim.simulate(5);
    expect(result).toEqual([{ ruleId: 'r1', result: true }]);
  });
});
