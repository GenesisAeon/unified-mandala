import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMetaScores } from '../hooks/useMetaScores';

export default function MetaScoreChart() {
  const scores = useMetaScores();

  if (!scores.length) {
    return <div>Keine Meta-Scores verfügbar.</div>;
  }

  return (
    <LineChart width={400} height={200} data={scores} aria-label="MetaScore Chart">
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="id" />
      <YAxis domain={[0, 1]} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
