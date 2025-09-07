import { useEffect, useState } from "react";

export type ResonanceLevel = "green" | "amber" | "red";
export interface ResonancePayload {
  entropy: number;
  level: ResonanceLevel;
  n: number;
  ts: string;
  source?: string;
}

export function useCrepResonance(refreshMs = 8000) {
  const [data, setData] = useState<ResonancePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOnce() {
    try {
      setLoading(true);
      const res = await fetch("/api/crep/resonance");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ResonancePayload;
      setData(json);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOnce();
    const t = setInterval(fetchOnce, refreshMs);
    return () => clearInterval(t);
  }, [refreshMs]);

  return { data, loading, error, refetch: fetchOnce };
}
