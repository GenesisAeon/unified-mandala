import React from 'react';

export interface ArchiveSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface ArchiveMapProps {
  sites: ArchiveSite[];
  onSelect?: (site: ArchiveSite) => void;
}

const width = 800;
const height = 400;

const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * width,
  y: ((90 - lat) / 180) * height,
});

const ArchiveMap: React.FC<ArchiveMapProps> = ({ sites, onSelect }) => (
  <svg width={width} height={height} aria-label="Archiv Menschheitsspuren Karte">
    {sites.map((s) => {
      const { x, y } = project(s.lat, s.lon);
      return (
        <circle
          key={s.id}
          cx={x}
          cy={y}
          r={5}
          fill="#e74c3c"
          role="button"
          aria-label={s.name}
          onClick={() => onSelect?.(s)}
        />
      );
    })}
  </svg>
);

export default ArchiveMap;
