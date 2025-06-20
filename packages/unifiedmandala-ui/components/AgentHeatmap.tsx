import React from 'react';
import { useAgentActivity } from '../hooks/useAgentActivity';

const AgentHeatmap: React.FC = () => {
  const activities = useAgentActivity();
  return (
    <section aria-label="Agent Heatmap">
      <h3>Agent Activity</h3>
      <ul>
        {activities.slice(-5).map((a, i) => (
          <li key={i}>{a.id}</li>
        ))}
      </ul>
    </section>
  );
};

export default AgentHeatmap;
