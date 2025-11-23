import { describe, it, expect } from 'vitest';
import { stableBoundaryEventKey } from '../event-key.js';

const base = {
  ruleId: 'demo-rule',
  source: 'demo/source.ts',
  ts: '2025-12-07T00:00:00.000Z',
  verdict: 'violation',
  severity: 'warn',
};

describe('stableBoundaryEventKey', () => {
  it('produces identical hashes for reordered payload keys', () => {
    const first = stableBoundaryEventKey({
      ...base,
      payload: {
        alpha: 1,
        beta: 'two',
        nested: { z: false, a: true },
      },
    });

    const second = stableBoundaryEventKey({
      ...base,
      payload: {
        nested: { a: true, z: false },
        beta: 'two',
        alpha: 1,
      },
    });

    expect(first).toBe(second);
  });

  it('handles circular and non-json values without throwing', () => {
    const payload: any = { value: Infinity };
    payload.self = payload;

    const key = stableBoundaryEventKey({
      ...base,
      payload,
    });

    expect(key).toMatch(/^[a-f0-9]{40}$/);
  });
});
