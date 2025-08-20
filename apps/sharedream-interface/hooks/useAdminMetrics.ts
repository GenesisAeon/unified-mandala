import { useEffect, useState } from 'react';

export interface AdminMetric {
  avgCREP: number;
  sigillinAdoption: number;
  openTodos: number;
  gpt5AvgLatency: number;
  gpt5SuccessRate: number;
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetric | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin-metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => {
        console.error('Fehler beim Laden der Admin-Metriken:', err);
        setError('Fehler beim Laden der Admin-Metriken');
      });
  }, []);

  return { metrics, error };
}
