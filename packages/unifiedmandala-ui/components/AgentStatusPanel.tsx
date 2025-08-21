import React, { useEffect, useState } from 'react';

interface AgentInfo {
  name: string;
  status: string;
}

/**
 * AgentStatusPanel displays a snapshot of agent statuses
 * by fetching data from `/api/agents/status`.
 */
export default function AgentStatusPanel() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agents/status')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        setAgents(json.agents || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div aria-label="AgentStatusPanel">Error: {error}</div>;
  }

  return (
    <div aria-label="AgentStatusPanel">
      <h3>Agent Status</h3>
      <ul>
        {agents.map((a) => (
          <li key={a.name}>
            {a.name}: {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
