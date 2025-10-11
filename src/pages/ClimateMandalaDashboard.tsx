import React from 'react';
import GeophysikSection, { GeophysikMetric } from '../components/GeophysikSection';
import { toMRV, TimeSeries } from '../utils/timeseries';

// Example time series demonstrating MRV export
const exampleSeries: TimeSeries = [
  { timestamp: new Date('2024-01-01'), value: 1.2 },
  { timestamp: new Date('2024-02-01'), value: 0.8 },
];

export default function ClimateMandalaDashboard() {
  const metrics: GeophysikMetric[] = [
    { label: 'Temperatur', value: 15, unit: '°C' },
    { label: 'Niederschlag', value: 20, unit: 'mm' },
  ];
  const mrvSummary = toMRV(exampleSeries);

  return (
    <main>
      <h1>Climate Mandala Dashboard</h1>
      <GeophysikSection metrics={metrics} />
      <section>
        <h2>MRV Summary</h2>
        <pre>{JSON.stringify(mrvSummary, null, 2)}</pre>
      </section>
    </main>
  );
}
