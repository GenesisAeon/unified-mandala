import React from 'react';

interface Props {
  freqs: number[];
}

const FrequencyMandala: React.FC<Props> = ({ freqs }) => {
  const center = 50;
  const base = 20;
  const points = freqs.map((f, i) => {
    const angle = (i / freqs.length) * 2 * Math.PI;
    const r = base + f * 5;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  });
  const pathData = points.join(' ') + ' Z';
  return (
    <svg width={100} height={100} aria-label="Frequency Mandala">
      <path d={pathData} fill="none" stroke="#4a90e2" />
    </svg>
  );
};

export default FrequencyMandala;
