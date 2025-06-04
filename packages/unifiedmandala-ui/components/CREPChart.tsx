import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CREPEntry } from '../../crep-engine/types';

interface CREPChartProps {
  history: CREPEntry[];
}

const CREPChart: React.FC<CREPChartProps> = ({ history }) => (
  <LineChart width={600} height={300} data={history}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="timestamp" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
    <YAxis domain={[0, 10]} />
    <Tooltip />
    <Line type="monotone" dataKey="C" stroke="#8884d8" />
    <Line type="monotone" dataKey="R" stroke="#82ca9d" />
    <Line type="monotone" dataKey="E" stroke="#ff7300" />
    <Line type="monotone" dataKey="P" stroke="#ff0000" />
  </LineChart>
);

export default CREPChart;
