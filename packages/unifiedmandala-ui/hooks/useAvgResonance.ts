import { useEffect, useState } from 'react';

export function useAvgResonance(idx = '1', endpoint = '/api/meta-scores') {
  const [avg, setAvg] = useState(0);
  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        const entry = data.scores.find((s: any) => s.idx === idx);
        if (entry) setAvg(entry.avgResonance);
      })
      .catch(() => {});
  }, [idx, endpoint]);
  return avg;
}
