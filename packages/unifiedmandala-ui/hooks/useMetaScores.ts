import { useEffect, useState } from 'react';

export interface MetaScoreEntry {
  layer: string;
  score: number;
}

export function useMetaScores(endpoint = '/api/meta-scores') {
  const [data, setData] = useState<MetaScoreEntry[]>([]);
  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [endpoint]);
  return data;
}
