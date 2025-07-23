import { describe, it, expect } from 'vitest';
import { BoundaryVisualDebugger } from '../BoundaryVisualDebugger';

describe('BoundaryVisualDebugger', () => {
  it('logs collisions', () => {
    const dbg = new BoundaryVisualDebugger();
    dbg.logCollision('A', 'B');
    expect(dbg.logs).toContain('A-B');
  });
});
