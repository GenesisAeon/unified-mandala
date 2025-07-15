import React from 'react';

export interface NullmembranSIHeatmapProps {
  values: number[];
}

export default function NullmembranSIHeatmap({ values }: NullmembranSIHeatmapProps) {
  if (values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (
    <div className="nullmembran-si-heatmap" aria-label="Nullmembran SI Heatmap">
      {values.map((v, i) => {
        const ratio = (v - min) / (max - min || 1);
        const color = `rgba(255, 0, 0, ${ratio.toFixed(2)})`;
        return (
          <div
            key={i}
            style={{
              display: 'inline-block',
              width: '10px',
              height: '20px',
              backgroundColor: color,
            }}
            title={v.toFixed(2)}
          />
        );
      })}
    </div>
  );
}
