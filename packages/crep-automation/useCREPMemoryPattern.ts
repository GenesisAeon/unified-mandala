import { useEffect, useState } from 'react';
import { AeonMemory, MemoryEntry } from '../core/AeonMemory';

export function useCREPMemoryPattern(n = 5) {
  const [pattern, setPattern] = useState<string>('');

  useEffect(() => {
    AeonMemory.load();
    const entries: MemoryEntry[] = AeonMemory.latest(n);
    setPattern(entries.map(e => e.description).join(' | '));
  }, [n]);

  return pattern;
}
