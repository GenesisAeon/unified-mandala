import React from 'react';

interface SigillinFractalVisualizerProps {
  sigillinData: Array<{ id: string; value: number }>;
}

const SigillinFractalVisualizer: React.FC<SigillinFractalVisualizerProps> = ({ sigillinData }) => (
  <div aria-label="Sigillin Fraktalkunst">
    {sigillinData.map(sigil => (
      <div
        key={sigil.id}
        data-testid="fractal-piece"
        style={{
          width: 20,
          height: 20,
          margin: 2,
          backgroundColor: `hsl(${(sigil.value * 40) % 360}, 70%, 50%)`,
          transform: `scale(${1 + sigil.value * 0.1})`,
        }}
      />
    ))}
  </div>
);

export default SigillinFractalVisualizer;
