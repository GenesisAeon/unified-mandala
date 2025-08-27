export type SeriesPoint = { t: string; v: number; [k: string]: unknown };
export type Series = { id: string; unit?: string; meta?: Record<string, unknown>; points: SeriesPoint[] };
export interface ClimateAdapter {
  id: string;
  fetchSeries(params: Record<string, unknown>): Promise<Series>;
}
