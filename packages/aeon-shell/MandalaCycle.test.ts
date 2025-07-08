import { MandalaCycle } from './MandalaCycle';

describe('MandalaCycle', () => {
  it('refresh updates weightFactor', () => {
    const cycle = new MandalaCycle({ cosmicFactor: 2 });
    cycle.weightFactor = 0 as any;
    cycle.refresh(3);
    expect(cycle.weightFactor).toBeGreaterThan(0);
  });
});
