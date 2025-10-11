import React from 'react';

interface Props {
  metrics?: { label: string; value: number }[];
}

const OpenEthikDashboard: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Open Ethik Dashboard</h2>
      <ul>
        {metrics?.map((m) => (
          <li key={m.label}>
            {m.label}: {m.value}
          </li>
        )) || <li>No data available</li>}
      </ul>
    </div>
  );
};

export default OpenEthikDashboard;
