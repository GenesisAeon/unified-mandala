import { Adapter, AdapterInput, AdapterResult } from "../base";

export interface RateLimitOpts {
  capacity: number;     // erlaubte Aufrufe pro Intervall
  intervalMs: number;   // Fenstergröße
}

export function withRateLimit<T>(opts: RateLimitOpts) {
  const { capacity, intervalMs } = opts;
  const hits: number[] = []; // Zeitstempel (ms)

  async function acquire(): Promise<void> {
    const now = Date.now();
    // alte Hits entfernen
    while (hits.length && now - hits[0] >= intervalMs) hits.shift();
    if (hits.length < capacity) {
      hits.push(now);
      return;
    }
    // warten bis erstes Ticket ausläuft
    const waitFor = intervalMs - (now - hits[0]);
    await new Promise(r => setTimeout(r, Math.max(0, waitFor)));
    // nach Wartezeit nochmal probieren (rekursiv)
    return acquire();
  }

  return (next: Adapter<T>): Adapter<T> => {
    return async (input?: AdapterInput): Promise<AdapterResult<T>> => {
      await acquire();
      return next(input);
    };
  };
}
