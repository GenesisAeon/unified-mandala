import { describe, it, expect } from 'vitest';
import { ok, fail, keyOf } from '../../src/adapters/base';
import { fetchEFFIS } from '../../src/adapters/effis';
import { fetchOISST } from '../../src/adapters/oisst';
import { fetchRadar } from '../../src/adapters/radar';
import { fetchSPEI } from '../../src/adapters/spei';
import { fetchBiodiversitaet } from '../../src/adapters/biodiversitaet';

describe('adapters/base helpers', () => {
  it('ok and fail shape', () => {
    expect(ok(1)).toEqual({ ok: true, data: 1, meta: {} });
    expect(fail('e')).toEqual({ ok: false, error: 'e', meta: {} });
  });
  it('keyOf sorts keys for stable cache key', () => {
    const k1 = keyOf({ params: { b: 2, a: 1 } });
    const k2 = keyOf({ params: { a: 1, b: 2 } });
    expect(k1).toBe(k2);
  });
});

describe('adapters placeholder fetchers', () => {
  it('return empty series for now', async () => {
    expect(await fetchEFFIS()).toEqual([]);
    expect(await fetchOISST()).toEqual([]);
    expect(await fetchRadar()).toEqual([]);
    expect(await fetchSPEI()).toEqual([]);
    expect(await fetchBiodiversitaet()).toEqual([]);
  });
});
