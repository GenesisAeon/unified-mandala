import React from 'react';

export interface DashboardProps {
  metrics: Record<string, number>;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics }) => (
  <div>
    <h2>Universe Simulation Metrics</h2>
    <ul>
      {Object.entries(metrics).map(([key, value]) => (
        <li key={key} data-testid={`metric-${key}`}>
          {key}: {value}
        </li>
      ))}
    </ul>
  </div>
);

export default Dashboard;
