import { describe, it, expect } from 'vitest';
import { era5, oisst } from '../index';

describe('adapters pipeline (schema + cache + rate + retry)', () => {
  it('era5 returns ok and caches subsequent call', async () => {
    const r1 = await era5({ params: { a: 1, b: 2 } });
    expect(r1.ok).toBe(true);
    expect(r1.data).toBeTruthy();
    // second call with same params should be cached
    const r2 = await era5({ params: { b: 2, a: 1 } });
    expect(r2.ok).toBe(true);
    expect(r2.cached).toBe(true);
  });

  it('oisst returns ok and matches schema', async () => {
    const res = await oisst({ params: { region: 'X' } });
    expect(res.ok).toBe(true);
    expect(res.data).toBeTruthy();
    // basic shape assertions
    const d: any = res.data;
    expect(typeof d.region).toBe('string');
    expect(Array.isArray(d.sst)).toBe(true);
  });
});
