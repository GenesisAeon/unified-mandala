import React from 'react';

export interface BoundaryLawDashboardProps {
  laws: string[];
  macroHypotheses?: string[];
}

export default function BoundaryLawDashboard({ laws, macroHypotheses = [] }: BoundaryLawDashboardProps) {
  return (
    <div>
      <h2>Boundary Laws</h2>
      <ul>
        {laws.map(law => (
          <li key={law}>{law}</li>
        ))}
      </ul>
      {macroHypotheses.length > 0 && (
        <>
          <h3>Macro Hypotheses</h3>
          <ul>
            {macroHypotheses.map(h => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
