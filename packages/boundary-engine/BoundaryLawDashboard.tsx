import React from 'react';

export interface BoundaryLawDashboardProps {
  laws: string[];
}

export default function BoundaryLawDashboard({ laws }: BoundaryLawDashboardProps) {
  return (
    <div data-testid="boundary-law-dashboard">
      <h2>Boundary Law Dashboard</h2>
      <ul>
        {laws.map((law, idx) => (
          <li key={idx}>{law}</li>
        ))}
      </ul>
    </div>
  );
}
