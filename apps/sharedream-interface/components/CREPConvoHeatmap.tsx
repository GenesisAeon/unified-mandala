import React from 'react';

export interface HeatmapPoint { time: string; value: number; }

export default function CREPConvoHeatmap({ data }: { data: HeatmapPoint[] }) {
  return (
    <svg aria-label="CREP Heatmap" width={200} height={100}>
      {data.map((d, i) => (
        <rect
          key={i}
          x={i * 10}
          y={100 - d.value * 100}
          width={8}
          height={d.value * 100}
          fill="blue"
        />
      ))}
    </svg>
  );
}
