import React, { useEffect, useState } from 'react';
import { PoeticState } from '../../core/AeonSigillinVault';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

interface Crystal {
  id: string;
  color: string;
  size: number;
  phrase: string;
}

export const CrystalOrakel: React.FC = () => {
  const [crystals, setCrystals] = useState<Crystal[]>([]);

  useEffect(() => {
    GPTEventHub.on('orakel:says', (msg: PoeticState) => {
      const hue = Math.floor(Math.random() * 360);
      setCrystals(prev => [
        {
          id: msg.id,
          color: `hsl(${hue},80%,60%)`,
          size: 20 + Math.random() * 40,
          phrase: msg.content
        },
        ...prev.slice(0, 9)
      ]);
    });
  }, []);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-72 bg-black rounded">
      {crystals.map((c, i) => {
        const angle = (i / crystals.length) * Math.PI * 2;
        const r = 100;
        const x = 150 + r * Math.cos(angle);
        const y = 150 + r * Math.sin(angle);
        return (
          <g key={c.id}>
            <polygon
              points={`
                ${x},${y - c.size}
                ${x - c.size / 2},${y + c.size}
                ${x + c.size / 2},${y + c.size}
              `}
              fill={c.color}
              opacity={0.8}
            />
            <text x={x} y={y + c.size + 12} textAnchor="middle" fill={c.color} fontSize="8">
              {c.phrase.slice(0, 10)}…
            </text>
          </g>
        );
      })}
    </svg>
  );
};
