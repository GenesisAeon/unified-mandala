import React from 'react';
import ThresholdIndicator from './ThresholdIndicator';

export interface CREPValues {
  C: number;
  R: number;
  E: number;
  P: number;
  Gamma?: number;
}

// Standard-Schwellenwerte aus Q4Mapper (genesis-os/core/q4_mapper.py)
export const DEFAULT_THRESHOLDS: Record<string, number> = {
  C: 0.5,
  R: 0.6,
  E: 0.7,
  P: 0.8,
};

interface CREPOverlayProps {
  values: CREPValues;
  thresholds?: Record<string, number>;
}

export default function CREPOverlay({ values, thresholds = DEFAULT_THRESHOLDS }: CREPOverlayProps) {
  const dims: Array<{ key: keyof CREPValues; label: string }> = [
    { key: 'C', label: 'Kohärenz' },
    { key: 'R', label: 'Resonanz' },
    { key: 'E', label: 'Emergenz' },
    { key: 'P', label: 'Poetik' },
  ];

  return (
    <div
      aria-label="CREP Float-Metriken"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      {dims.map(({ key, label }) => (
        <ThresholdIndicator
          key={key}
          dimension={String(key)}
          label={label}
          value={values[key] as number}
          threshold={thresholds[String(key)] ?? 0.5}
        />
      ))}
      {values.Gamma != null && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
          Γ = {values.Gamma.toFixed(3)}
        </div>
      )}
    </div>
  );
}
