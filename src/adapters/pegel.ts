import type { ClimateAdapter, Series } from './types';
export const PegelAdapter: ClimateAdapter = {
  id: 'pegel',
  async fetchSeries(params): Promise<Series> {
    const station = String(params.station ?? 'KOLN');
    const points = Array.from({ length: 48 }, (_, i) => ({
      t: new Date(Date.now() - (47 - i) * 1800_000).toISOString(),
      v: 300 + Math.sin(i / 12) * 5,
    }));
    return { id: `pegel_${station}`, unit: 'cm', meta: { station }, points };
  },
};
