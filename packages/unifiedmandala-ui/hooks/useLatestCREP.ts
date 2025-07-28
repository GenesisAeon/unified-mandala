import { useEffect, useState } from 'react';

export function useLatestCREP() {
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    globalThis.fetch('/api/crep/latest')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => {
        if (isMounted) setValue(data.value);
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, error };
}
