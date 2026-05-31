import React from 'react';

interface NodeHighlighterProps {
  x: number;
  y: number;
  id: number;
  isActive: boolean;
  isPrevious?: boolean;
}

export default function NodeHighlighter({ x, y, id, isActive, isPrevious }: NodeHighlighterProps) {
  const r = isActive ? 7 : isPrevious ? 5 : 3.5;
  const fill = isActive ? '#3b82f6' : isPrevious ? '#6366f1' : '#334155';
  const stroke = isActive ? '#93c5fd' : isPrevious ? '#a5b4fc' : 'none';

  return (
    <g>
      {isActive && <circle cx={x} cy={y} r={12} fill="rgba(59,130,246,0.12)" />}
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={isActive ? 1.5 : 0} />
      {isActive && (
        <text
          x={x}
          y={y - 10}
          fontSize="8"
          fill="#93c5fd"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {id.toString(2).padStart(4, '0')}
        </text>
      )}
    </g>
  );
}
