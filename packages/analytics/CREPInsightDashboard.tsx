import React from 'react';

export interface CREPInsightDashboardProps {
  score: number;
}

export function CREPInsightDashboard({ score }: CREPInsightDashboardProps) {
  const level = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
  const percentage = Math.max(0, Math.min(10, score)) * 10;

  return (
    <div>
      <div data-testid="score">{score}</div>
      <div data-testid="level">{level}</div>
      <div data-testid="bar-container" style={{ background: '#eee', width: '100%', height: '8px' }}>
        <div
          data-testid="bar"
          style={{ background: '#3b82f6', width: `${percentage}%`, height: '100%' }}
        />
      </div>
    </div>
  );
}
