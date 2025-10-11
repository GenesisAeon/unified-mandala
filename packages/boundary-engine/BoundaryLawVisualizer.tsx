import React from 'react';

export interface BoundaryLawVisualizerProps {
  laws: string[];
}

export default function BoundaryLawVisualizer({ laws }: BoundaryLawVisualizerProps) {
  return (
    <ul>
      {laws.map((law) => (
        <li key={law}>{law}</li>
      ))}
    </ul>
  );
}
