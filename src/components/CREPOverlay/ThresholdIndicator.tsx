import React from 'react';

interface ThresholdIndicatorProps {
  dimension: string;
  label: string;
  value: number;
  threshold: number;
}

export default function ThresholdIndicator({
  dimension,
  label,
  value,
  threshold,
}: ThresholdIndicatorProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  const thresholdPct = threshold * 100;
  const isAbove = value >= threshold;

  return (
    <div aria-label={`${label}: ${value.toFixed(2)}, Schwellenwert ${threshold}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
          {dimension} — {label}
        </span>
        <span style={{ fontSize: '0.75rem', color: isAbove ? '#22d3ee' : '#475569' }}>
          {value.toFixed(2)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={1}
        style={{
          position: 'relative',
          height: '6px',
          background: '#1e293b',
          borderRadius: '3px',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: isAbove ? '#22d3ee' : '#334155',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }}
        />
        {/* Schwellenwert-Marker */}
        <div
          aria-label={`Schwellenwert ${threshold}`}
          style={{
            position: 'absolute',
            top: '-2px',
            left: `${thresholdPct}%`,
            width: '2px',
            height: '10px',
            background: '#f59e0b',
            borderRadius: '1px',
          }}
        />
      </div>
    </div>
  );
}
