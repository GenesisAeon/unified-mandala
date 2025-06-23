import { useEffect, useState } from 'react';

export function usePulse(interval = 1000) {
  const [pulse, setPulse] = useState(70);
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(60 + Math.round(Math.random() * 40));
    }, interval);
    return () => clearInterval(id);
  }, [interval]);
  return pulse;
}
