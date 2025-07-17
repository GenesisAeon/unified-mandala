import { BoundaryConditionManager } from './BoundaryConditionManager';

describe('BoundaryConditionManager', () => {
  it('adds and checks conditions', () => {
    const mgr = new BoundaryConditionManager();
    mgr.addCondition('safe');
    expect(mgr.has('safe')).toBe(true);
    expect(mgr.checkAll(['safe'])).toBe(true);
    expect(mgr.checkAll(['safe', 'other'])).toBe(false);
  });
});
