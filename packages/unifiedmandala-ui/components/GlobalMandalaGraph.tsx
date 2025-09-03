import React from 'react';

export interface MandalaNode {
  id: string;
  label: string;
  capabilities: string[];
}

export interface GlobalMandalaGraphProps {
  nodes: MandalaNode[];
}

/**
 * GlobalMandalaGraph visualizes the connected Mandala instances and their capabilities.
 * Currently renders a simple list but can evolve into a full graph visualization.
 */
const GlobalMandalaGraph: React.FC<GlobalMandalaGraphProps> = ({ nodes }) => {
  return (
    <div>
      <h2>Global Mandala Graph</h2>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            {node.label}: {node.capabilities.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlobalMandalaGraph;
