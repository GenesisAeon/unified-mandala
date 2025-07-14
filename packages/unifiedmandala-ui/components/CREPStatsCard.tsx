import React from 'react';
import { LineChart, Line } from 'recharts';

export interface CREPStatsCardProps {
  avgResonance: number;
  history?: number[];
}

export default function CREPStatsCard({
  avgResonance,
  history = [],
}: CREPStatsCardProps) {
  const data = history.map((val, idx) => ({ idx, val }));
  return (
    <div className="crep-stats-card">
      <strong>Avg Resonance:</strong> {avgResonance.toFixed(2)}
      {history.length > 0 && (
        <LineChart
          width={120}
          height={80}
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <Line type="monotone" dataKey="val" stroke="#82ca9d" dot={false} />
        </LineChart>
      )}
    </div>
  );
}
