import { useEffect, useState } from 'react';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

export interface AgentActivity {
  id: string;
  timestamp: string;
}

export function useAgentActivity() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);

  useEffect(() => {
    const handler = (data: AgentActivity) => {
      setActivities((a) => [...a.slice(-49), data]);
    };
    GPTEventHub.on('agentActivity', handler);
    return () => {
      GPTEventHub.off('agentActivity', handler);
    };
  }, []);

  return activities;
}
