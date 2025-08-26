import { TimeSeries } from './types';

export interface QCReport {
  /** total number of points */
  total: number;
  /** number of points with null or NaN values */
  missing: number;
  /** number of points with invalid timestamps */
  invalid: number;
}

/**
 * Perform simple quality checks on a time series.
 */
export function qualityControl(series: TimeSeries): QCReport {
  let missing = 0;
  let invalid = 0;
  for (const p of series) {
    if (p.value === null || Number.isNaN(p.value)) {
      missing++;
    }
    if (!(p.timestamp instanceof Date) || isNaN(p.timestamp.getTime())) {
      invalid++;
    }
  }
  return { total: series.length, missing, invalid };
}
