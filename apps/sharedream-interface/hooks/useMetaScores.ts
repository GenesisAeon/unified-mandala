import { useEffect, useState } from 'react';

export interface MetaScore { id: string; value: number; }

export function useMetaScores() {
  const [scores, setScores] = useState<MetaScore[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/meta-scores')
      .then((res) => res.json())
      .then((data) => setScores(data.scores || []))
      .catch((err) => {
        console.error('Fehler beim Laden der Meta-Scores:', err);
        setError('Fehler beim Laden der Meta-Scores');
      });
  }, []);

  return { scores, error };
}
