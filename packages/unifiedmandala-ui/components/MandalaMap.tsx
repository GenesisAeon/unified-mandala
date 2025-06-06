import React from 'react';

export interface MandalaNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

interface MandalaMapProps {
  nodes: MandalaNode[];
}

const MandalaMap: React.FC<MandalaMapProps> = ({ nodes }) => (
  <svg width={600} height={400} aria-label="Mandala Map">
    {nodes.map(n => (
      <g key={n.id} transform={`translate(${n.x},${n.y})`}>
        <circle r={10} fill="#4a90e2" />
        {n.label && (
          <text x={0} y={-12} textAnchor="middle" fontSize="10">
            {n.label}
          </text>
        )}
      </g>
    ))}
  </svg>
);

export default MandalaMap;

