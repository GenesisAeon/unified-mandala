import { describe, it, expect } from 'vitest';
import { era5Raw } from '../impl/era5.stub';
import { oisstRaw } from '../impl/oisst.stub';

describe('impl stubs', () => {
  it('era5Raw returns deterministic sample', async () => {
    const res = await era5Raw();
    expect(res.ok).toBe(true);
    const d: any = res.data;
    expect(d?.location).toBe('global');
    expect(Array.isArray(d?.values)).toBe(true);
    expect(d?.unit).toBeDefined();
  });

  it('oisstRaw returns deterministic sample', async () => {
    const res = await oisstRaw();
    expect(res.ok).toBe(true);
    const d: any = res.data;
    expect(d?.region).toBe('pacific');
    expect(Array.isArray(d?.sst)).toBe(true);
    expect(d?.unit).toBeDefined();
  });
});
