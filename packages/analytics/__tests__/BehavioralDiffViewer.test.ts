import { describe, it, expect } from 'vitest';
import BehavioralDiffViewer, { BehaviorSnapshot } from '../BehavioralDiffViewer';

describe('BehavioralDiffViewer', () => {
  it('detects added, removed and changed responses', () => {
    const baseline: BehaviorSnapshot[] = [
      { id: '1', response: 'hello' },
      { id: '2', response: 'foo' },
    ];
    const current: BehaviorSnapshot[] = [
      { id: '1', response: 'hello world' },
      { id: '3', response: 'bar' },
    ];

    const diff = BehavioralDiffViewer.diff(baseline, current);

    expect(diff.added).toEqual([{ id: '3', response: 'bar' }]);
    expect(diff.removed).toEqual([{ id: '2', response: 'foo' }]);
    expect(diff.changed).toEqual([{ id: '1', from: 'hello', to: 'hello world' }]);
  });
});
