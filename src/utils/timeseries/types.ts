export interface TimeSeriesPoint {
  /** Timestamp of the measurement */
  timestamp: Date;
  /** Numeric value, null when missing */
  value: number | null;
}

export type TimeSeries = TimeSeriesPoint[];
