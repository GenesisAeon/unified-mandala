import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMetaScores } from '../hooks/useMetaScores';

const MetricsDashboard: React.FC = () => {
  const data = useMetaScores();
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="layer" />
      <YAxis domain={[0, 1]} />
      <Tooltip />
      <Line type="monotone" dataKey="score" stroke="#82ca9d" />
    </LineChart>
  );
};

export default MetricsDashboard;
