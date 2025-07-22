import { describe, it, expect } from 'vitest';
import { PantheonBoundaryBridge } from './PantheonBoundaryBridge';

describe('PantheonBoundaryBridge', () => {
  it('bridges events to boundary detection', () => {
    const bridge = new PantheonBoundaryBridge();
    const result = bridge.bridge('hello boundary foo', ['foo']);
    expect(result).toEqual([{ rule: 'foo', occurrences: 1 }]);
  });
});
