import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import fourierBridge, { connectFourierBridge } from '../api/fourierBridge';

interface MetricsData {
  id: string;
  metrics: { maxAmplitude: number; avgAmplitude: number };
}

export default function FourierVisual() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const handler = (payload: MetricsData) => {
      setData([
        { name: 'max', value: payload.metrics.maxAmplitude },
        { name: 'avg', value: payload.metrics.avgAmplitude },
      ]);
    };
    const ws = connectFourierBridge();
    fourierBridge.on('fourier:metrics', handler);
    return () => {
      fourierBridge.off('fourier:metrics', handler);
      (ws as any).close?.();
    };
  }, []);

  if (!data.length) return <div>No data</div>;
  return (
    <BarChart width={200} height={100} data={data} aria-label="Fourier Visual">
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
}
