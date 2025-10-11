import React from 'react';

export interface CREPBadgeProps {
  score?: number;
}

function label(score: number): { text: string; bg: string } {
  if (score >= 0.85) return { text: 'Ultra', bg: '#2e7d32' };
  if (score >= 0.65) return { text: 'High', bg: '#ed6c02' };
  if (score >= 0.4) return { text: 'Med', bg: '#fbc02d' };
  return { text: 'Low', bg: '#c62828' };
}

export default function CREPBadge({ score }: CREPBadgeProps) {
  if (typeof score !== 'number') return null;
  const { text, bg } = label(score);
  return (
    <span
      title={`CREP ${score.toFixed(2)}`}
      style={{
        backgroundColor: bg,
        color: '#fff',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 12,
        minWidth: 40,
        textAlign: 'center',
      }}
    >
      {text}
    </span>
  );
}
