import React from 'react';
interface CREPStatsCardProps { avgResonance: number }
export default function CREPStatsCard({ avgResonance }: CREPStatsCardProps) {
  return (
    <div className="crep-stats-card">
      <strong>Avg Resonance:</strong> {avgResonance}
      {/* TODO: Mini-Chart hier einfügen */}
    </div>
  );
}
