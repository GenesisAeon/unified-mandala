import React from 'react';

export interface AdminMetricsProps {
  avgCREP: number;
  sigillinAdoption: number;
  openTodos: number;
  gpt5AvgLatency: number;
  gpt5SuccessRate: number;
}

export default function AdminMetrics({
  avgCREP,
  sigillinAdoption,
  openTodos,
  gpt5AvgLatency,
  gpt5SuccessRate,
}: AdminMetricsProps) {
  return (
    <div aria-label="Admin Metrics">
      <div>CREP Durchschnitt: {avgCREP.toFixed(2)}</div>
      <div>Sigillin Adoption: {sigillinAdoption}</div>
      <div>Offene ToDos: {openTodos}</div>
      <div className="gpt5-badge">
        GPT-5: {gpt5AvgLatency}ms / {Math.round(gpt5SuccessRate * 100)}%
      </div>
    </div>
  );
}
