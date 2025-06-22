import { useEffect, useState } from 'react';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

export function useEventGlow(eventType: string) {
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    const handler = () => {
      setGlow(true);
      setTimeout(() => setGlow(false), 1000);
    };
    GPTEventHub.on(eventType, handler);
    return () => GPTEventHub.off(eventType, handler);
  }, [eventType]);
  return glow;
}
