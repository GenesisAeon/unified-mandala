import type { ClimateAdapter, Series } from './types';
export const ERA5Adapter: ClimateAdapter = {
  id: 'era5',
  async fetchSeries(params): Promise<Series> {
    const points = Array.from({ length: 24 }, (_, i) => ({
      t: new Date(Date.now() - (23 - i) * 3600_000).toISOString(),
      v: 273.15 + 10 + Math.sin((i / 24) * Math.PI * 2) * 5,
    }));
    return { id: 'era5_t2m', unit: 'K', meta: { params }, points };
  },
};
