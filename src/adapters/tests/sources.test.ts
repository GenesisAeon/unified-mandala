import { describe, it, expect } from 'vitest';
import { fetchBiodiversitaet } from '../biodiversitaet';
import { fetchEFFIS } from '../effis';
import { ERA5Adapter } from '../era5';
import { fetchOISST } from '../oisst';
import { PegelAdapter } from '../pegel';
import { fetchRadar } from '../radar';
import { fetchSPEI } from '../spei';

describe('data source adapters', () => {
  it('fetchBiodiversitaet returns empty timeseries placeholder', async () => {
    const ts = await fetchBiodiversitaet();
    expect(Array.isArray(ts)).toBe(true);
  });

  it('fetchEFFIS returns empty timeseries placeholder', async () => {
    const ts = await fetchEFFIS();
    expect(Array.isArray(ts)).toBe(true);
  });

  it('fetchOISST returns empty timeseries placeholder', async () => {
    const ts = await fetchOISST();
    expect(Array.isArray(ts)).toBe(true);
  });

  it('fetchRadar returns empty timeseries placeholder', async () => {
    const ts = await fetchRadar();
    expect(Array.isArray(ts)).toBe(true);
  });

  it('fetchSPEI returns empty timeseries placeholder', async () => {
    const ts = await fetchSPEI();
    expect(Array.isArray(ts)).toBe(true);
  });

  it('ERA5Adapter returns a Series with points', async () => {
    const res = await ERA5Adapter.fetchSeries({});
    expect(res.id).toContain('era5');
    expect(res.unit).toBe('K');
    expect(Array.isArray(res.points)).toBe(true);
    expect(res.points.length).toBeGreaterThan(0);
  });

  it('PegelAdapter returns a Series with station metadata', async () => {
    const res = await PegelAdapter.fetchSeries({ station: 'TEST' });
    expect(res.id).toContain('pegel');
    expect(res.meta?.station).toBe('TEST');
    expect(res.points.length).toBeGreaterThan(0);
  });
});
