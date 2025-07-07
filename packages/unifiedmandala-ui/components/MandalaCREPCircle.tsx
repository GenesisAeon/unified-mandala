import React from 'react';
import { RadialBarChart, RadialBar } from 'recharts';

interface MandalaCREPCircleProps {
  value: number;
  max?: number;
}

const MandalaCREPCircle: React.FC<MandalaCREPCircleProps> = ({ value, max = 10 }) => {
  const data = [{ name: 'CREP', value }];
  return (
    <RadialBarChart width={200} height={200} innerRadius="80%" outerRadius="100%" data={data}>
      <RadialBar dataKey="value" fill="#8884d8" cornerRadius={10} />
    </RadialBarChart>
  );
};

export default MandalaCREPCircle;
