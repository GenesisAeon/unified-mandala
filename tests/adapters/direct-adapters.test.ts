import { describe, it, expect } from 'vitest';
import { ERA5Adapter } from '../../src/adapters/era5';
import { PegelAdapter } from '../../src/adapters/pegel';
import { fetchEFFIS } from '../../src/adapters/effis';
import { fetchOISST } from '../../src/adapters/oisst';
import { fetchRadar } from '../../src/adapters/radar';
import { fetchSPEI } from '../../src/adapters/spei';
import { fetchBiodiversitaet } from '../../src/adapters/biodiversitaet';
import * as base from '../../src/adapters/base';

describe('adapters direct modules', () => {
  it('ERA5Adapter.fetchSeries returns series', async () => {
    const s = await ERA5Adapter.fetchSeries({});
    expect(s.id).toContain('era5');
    expect(Array.isArray(s.points)).toBe(true);
  });

  it('PegelAdapter.fetchSeries returns series', async () => {
    const s = await PegelAdapter.fetchSeries({ station: 'KOLN' });
    expect(s.id).toContain('pegel');
    expect(Array.isArray(s.points)).toBe(true);
  });

  it('Placeholder fetchers return empty arrays', async () => {
    expect(await fetchEFFIS()).toEqual([]);
    expect(await fetchOISST()).toEqual([]);
    expect(await fetchRadar()).toEqual([]);
    expect(await fetchSPEI()).toEqual([]);
    expect(await fetchBiodiversitaet()).toEqual([]);
  });

  it('base helpers ok/fail/keyOf work', () => {
    expect(base.ok(123)).toEqual({ ok: true, data: 123, meta: {} });
    expect(base.fail('x')).toEqual({ ok: false, error: 'x', meta: {} });
    const k = base.keyOf({ params: { b: 2, a: 1 } });
    expect(k).toBe('{"a":1,"b":2}');
  });
});
