import React from 'react';

interface MandalaFlowDashboardProps {
  steps: string[];
}

const MandalaFlowDashboard: React.FC<MandalaFlowDashboardProps> = ({ steps }) => (
  <div aria-label="Mandala Flow Dashboard">
    <h3>Mandala Flow</h3>
    <ol>
      {steps.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  </div>
);

export default MandalaFlowDashboard;
