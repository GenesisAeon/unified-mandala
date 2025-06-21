import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export interface MetaScoreDatum {
  layer: string;
  score: number;
}

interface Props {
  data: MetaScoreDatum[];
}

const MetaScoreChart: React.FC<Props> = ({ data }) => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="layer" />
    <YAxis domain={[0, 1]} />
    <Tooltip />
    <Bar dataKey="score" fill="#8884d8" />
  </BarChart>
);

export default MetaScoreChart;
