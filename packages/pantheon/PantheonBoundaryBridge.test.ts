import { describe, it, expect } from 'vitest';
import { PantheonBoundaryBridge } from './PantheonBoundaryBridge';

describe('PantheonBoundaryBridge', () => {
  it('bridges events to boundary detection and emits', () => {
    let emitted: any[] | null = null;
    const bridge = new PantheonBoundaryBridge(m => {
      emitted = m;
    });
    const result = bridge.bridge('hello boundary foo', ['foo']);
    expect(result).toEqual([{ rule: 'foo', occurrences: 1 }]);
    expect(emitted).toEqual(result);
  });
});
