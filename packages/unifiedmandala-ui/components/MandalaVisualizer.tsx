import React, { useEffect, useState } from 'react';

interface Metrics {
  activeUsers: number;
  tasksCompleted: number;
  averageCREP: number;
}

const MandalaVisualizer: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(setMetrics)
      .catch(() => {});
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div aria-label="Mandala Visualizer">
      <p>Active: {metrics.activeUsers}</p>
      <p>Tasks: {metrics.tasksCompleted}</p>
      <p>Avg CREP: {metrics.averageCREP}</p>
    </div>
  );
};

export default MandalaVisualizer;
