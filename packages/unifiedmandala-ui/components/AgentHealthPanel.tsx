import React, { useEffect, useState } from 'react';

export interface AgentHeartbeat {
  agentId: string;
  status?: string;
  [key: string]: any;
}

export const AgentHealthPanel: React.FC = () => {
  const [data, setData] = useState<AgentHeartbeat[]>([]);

  const load = () => {
    fetch('/api/agents/health')
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : d.agents || [];
        setData(arr);
      })
      .catch(() => setData([]));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-label="agent-health-panel">
      <ul>
        {data.map((hb) => (
          <li key={hb.agentId} aria-label={`agent-${hb.agentId}`}>
            {hb.agentId}: {hb.status ?? 'unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentHealthPanel;

