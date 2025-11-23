import { describe, it, expect } from 'vitest';

describe('scripts/smoke/boundary-smoke helpers', () => {
  it('extracts events from nested snapshots', async () => {
    const { extractEventsFromSnapshot } = await import('../../scripts/smoke/boundary-smoke.mjs');
    const sample = { laws: [{ eventKey: 'membrane:event#1' }] };
    const events = extractEventsFromSnapshot(sample);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ eventKey: 'membrane:event#1' });
  });

  it('flags missing eventKey entries', async () => {
    const { validateEventKeys } = await import('../../scripts/smoke/boundary-smoke.mjs');
    const result = validateEventKeys([
      { source: 'membrane', ruleId: 'membrane:event', verdict: 'violation' },
    ]);
    expect(result.ok).toBe(false);
    expect(result.missing).toHaveLength(1);
    expect(result.missing[0]).toMatchObject({ index: 0, ruleId: 'membrane:event' });
  });

  it('rejects duplicate event keys', async () => {
    const { validateEventKeys } = await import('../../scripts/smoke/boundary-smoke.mjs');
    const result = validateEventKeys([
      {
        eventKey: 'membrane:event#violation',
        source: 'membrane',
        ruleId: 'membrane:event',
        verdict: 'violation',
      },
      {
        eventKey: 'membrane:event#violation',
        source: 'membrane',
        ruleId: 'membrane:event',
        verdict: 'violation',
      },
    ]);
    expect(result.ok).toBe(false);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0]).toMatchObject({
      key: 'membrane:event#violation',
      previousIndex: 0,
      index: 1,
    });
  });

  it('accepts unique event keys', async () => {
    const { validateEventKeys } = await import('../../scripts/smoke/boundary-smoke.mjs');
    const result = validateEventKeys([
      {
        eventKey: 'membrane:event#violation',
        source: 'membrane',
        ruleId: 'membrane:event',
        verdict: 'violation',
      },
      {
        eventKey: 'membrane:event#resolve',
        source: 'membrane',
        ruleId: 'membrane:recovery',
        verdict: 'resolve',
      },
    ]);
    expect(result.ok).toBe(true);
    expect(result.missing).toHaveLength(0);
    expect(result.duplicates).toHaveLength(0);
  });
});
