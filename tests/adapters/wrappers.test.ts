import { describe, it, expect } from 'vitest';
import { era5, oisst } from '../../src/adapters/index';

describe('adapters/wrappers', () => {
  it('era5 wrapper returns schema-validated data and caches second call', async () => {
    const r1 = await era5({ params: { loc: 'x' } });
    expect(r1.ok).toBe(true);
    expect(r1.data).toMatchObject({ location: expect.any(String), values: expect.any(Array) });
    const r2 = await era5({ params: { loc: 'x' } });
    expect(r2.ok).toBe(true);
    expect(r2.cached).toBe(true);
  });

  it('oisst wrapper returns schema-validated data and caches second call', async () => {
    const r1 = await oisst({ params: { region: 'pacific' } });
    expect(r1.ok).toBe(true);
    expect(r1.data).toMatchObject({ region: expect.any(String), sst: expect.any(Array) });
    const r2 = await oisst({ params: { region: 'pacific' } });
    expect(r2.ok).toBe(true);
    expect(r2.cached).toBe(true);
  });
});
