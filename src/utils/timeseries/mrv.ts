import { TimeSeries } from './types';
import { qualityControl } from './quality';

export interface MRVSummary {
  /** number of observed points */
  count: number;
  /** arithmetic mean of available values */
  mean: number;
  /** number of missing values */
  missing: number;
}

/**
 * Convert a time series into a basic Measurement, Reporting and Verification summary.
 */
export function toMRV(series: TimeSeries): MRVSummary {
  const qc = qualityControl(series);
  const values = series
    .filter((p) => p.value !== null && !Number.isNaN(p.value))
    .map((p) => p.value as number);
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  return {
    count: series.length,
    mean,
    missing: qc.missing,
  };
}
