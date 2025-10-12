import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { membraneSigil } from '../../src/membrane';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('kpi/membrane-bridge stepOrBypass', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    // ensure modules re-evaluate FEATURE flags
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('bypasses when membrane feature is off (LOW_MEM=1)', async () => {
    process.env.LOW_MEM = '1';
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    const r = stepOrBypass('t2m', Date.now(), 1.23);
    expect(r).toEqual({ A: undefined, sigil: membraneSigil('subcritical'), severity: 'ok' });
  });

  it('uses membrane when feature is on (default)', async () => {
    delete process.env.LOW_MEM;
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    const r = stepOrBypass('groundwater', Date.now(), 2.5);
    expect(r.severity).toBe('ok');
    expect(typeof r.sigil).toBe('string');
  });
});
