import { BoundaryConditionManager } from './BoundaryConditionManager';

describe('BoundaryConditionManager', () => {
  it('adds and checks conditions', () => {
    const mgr = new BoundaryConditionManager();
    mgr.addCondition('safe');
    expect(mgr.has('safe')).toBe(true);
    expect(mgr.checkAll(['safe'])).toBe(true);
    expect(mgr.checkAll(['safe', 'other'])).toBe(false);
  });

  it('validates numeric boundaries and emits events', () => {
    const mgr = new BoundaryConditionManager();
    const updates: any[] = [];
    mgr.on('update', (u) => updates.push(u));
    mgr.addNumericBoundary('speed', 0, 5);
    expect(mgr.checkValue('speed', 3)).toBe(true);
    expect(mgr.checkValue('speed', 6)).toBe(false);
    expect(updates).toHaveLength(1);
    expect(updates[0]).toEqual({ type: 'numeric', name: 'speed', min: 0, max: 5 });
  });
});
