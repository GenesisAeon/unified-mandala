import React from 'react';

export interface Capability {
  name: string;
  enabled: boolean;
  gatedBy?: string[];
}

export interface CapabilityGraphProps {
  capabilities: Capability[];
}

const CapabilityGraph: React.FC<CapabilityGraphProps> = ({ capabilities }) => {
  return (
    <div>
      <h2>Capability Graph</h2>
      <ul>
        {capabilities.map((cap) => (
          <li key={cap.name}>
            {cap.name}:{' '}
            {cap.enabled ? '✅' : `🚫 (gated by: ${cap.gatedBy?.join(', ') || 'unknown'})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CapabilityGraph;
