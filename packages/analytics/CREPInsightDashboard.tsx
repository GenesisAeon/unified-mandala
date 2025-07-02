import React from 'react';

export function CREPInsightDashboard({ score }: { score: number }) {
  return <div data-testid="score">{score}</div>;
}
