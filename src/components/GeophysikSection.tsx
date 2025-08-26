import React from 'react';

export interface GeophysikMetric {
  label: string;
  value: number;
  unit?: string;
}

export interface GeophysikSectionProps {
  metrics: GeophysikMetric[];
}

export default function GeophysikSection({ metrics }: GeophysikSectionProps) {
  return (
    <section>
      <h2>Geophysik</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {metrics.map((m) => (
          <div key={m.label} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
            <h3>{m.label}</h3>
            <p>
              {m.value}
              {m.unit && <span> {m.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

