import React from 'react';

export interface AdminMetricsProps {
  avgCREP: number;
  sigillinAdoption: number;
  openTodos: number;
}

export default function AdminMetrics({ avgCREP, sigillinAdoption, openTodos }: AdminMetricsProps) {
  return (
    <div aria-label="Admin Metrics">
      <div>CREP Durchschnitt: {avgCREP.toFixed(2)}</div>
      <div>Sigillin Adoption: {sigillinAdoption}</div>
      <div>Offene ToDos: {openTodos}</div>
    </div>
  );
}
