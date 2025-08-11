import React, { useState } from 'react';

export type AgentBackend = 'local' | 'external';

export interface AgentControlPanelProps {
  initialBackend?: AgentBackend;
  onBackendChange?: (backend: AgentBackend) => void;
}

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({
  initialBackend = 'local',
  onBackendChange,
}) => {
  const [backend, setBackend] = useState<AgentBackend>(initialBackend);

  const switchBackend = (target: AgentBackend) => {
    setBackend(target);
    onBackendChange?.(target);
  };

  return (
    <div aria-label="agent-control-panel">
      <button
        aria-label="select-local"
        onClick={() => switchBackend('local')}
        disabled={backend === 'local'}
      >
        Local
      </button>
      <button
        aria-label="select-external"
        onClick={() => switchBackend('external')}
        disabled={backend === 'external'}
      >
        External
      </button>
    </div>
  );
};

export default AgentControlPanel;
