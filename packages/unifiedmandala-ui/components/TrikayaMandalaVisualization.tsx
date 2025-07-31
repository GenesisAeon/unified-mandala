import React from 'react';

const layers = ['Nirmanakaya', 'Sambhogakaya', 'Dharmakaya'];

const styles: React.CSSProperties[] = [
  { background: 'rgba(255,0,0,0.3)' },
  { background: 'rgba(0,255,0,0.3)' },
  { background: 'rgba(0,0,255,0.3)' }
];

const TrikayaMandalaVisualization: React.FC = () => (
  <div style={{ position: 'relative', width: 200, height: 200 }}>
    {layers.map((l, i) => (
      <div
        key={l}
        data-testid={l}
        style={{
          position: 'absolute',
          inset: i * 10,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...styles[i]
        }}
      >
        {l}
      </div>
    ))}
  </div>
);

export default TrikayaMandalaVisualization;
