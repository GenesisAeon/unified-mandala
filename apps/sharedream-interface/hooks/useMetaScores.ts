import { useCallback, useEffect, useState } from 'react';

export interface MetaScore { id: string; value: number; }

export function useMetaScores() {
  const [scores, setScores] = useState<MetaScore[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScores = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetch('/api/meta-scores')
      .then((res) => res.json())
      .then((data) => {
        setScores(data.scores || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Meta-Scores:', err);
        setError('Fehler beim Laden der Meta-Scores');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchScores();
  }, []);

  const retry = () => fetchScores();

  return { scores, error, loading, retry };
}
