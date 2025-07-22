import { describe, it, expect } from 'vitest';
import { debugBoundaries } from './BoundaryVisualDebugger';

describe('BoundaryVisualDebugger', () => {
  it('formats boundaries', () => {
    expect(debugBoundaries(['a', 'b'])).toBe('debug:a|debug:b');
  });
});
