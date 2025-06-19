import { useEffect, useState } from 'react';

export interface MetaScore { id: string; value: number; }

export function useMetaScores() {
  const [scores, setScores] = useState<MetaScore[]>([]);

  useEffect(() => {
    fetch('/api/meta-scores')
      .then((res) => res.json())
      .then((data) => setScores(data.scores || []))
      .catch((err) => {
        console.error('Fehler beim Laden der Meta-Scores:', err);
      });
  }, []);

  return scores;
}
