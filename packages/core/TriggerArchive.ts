export interface TriggerEntry {
  label: string;
  timestamp: string;
}

export class TriggerArchive {
  private static archive: TriggerEntry[] = [];

  static record(label: string): void {
    this.archive.push({ label, timestamp: new Date().toISOString() });
  }

  static latest(n = 10): TriggerEntry[] {
    return this.archive.slice(-n);
  }
}

import { useState } from 'react';

export function useTriggerArchive() {
  const [triggers, setTriggers] = useState<TriggerEntry[]>(TriggerArchive.latest());

  const addTrigger = (label: string) => {
    TriggerArchive.record(label);
    setTriggers([...TriggerArchive.latest()]);
  };

  return { triggers, addTrigger };
}
