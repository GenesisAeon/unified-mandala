export interface CREPParts {
  coherence?: number;
  resonance?: number;
  emergence?: number;
  poetics?: number;
}

export interface NormalizedCREP {
  score: number;
  parts: { c?: number; r?: number; e?: number; p?: number };
}

function clamp(n: number | undefined): number | undefined {
  if (typeof n !== 'number' || isNaN(n)) return undefined;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export function normalizeCREP(x: number | CREPParts | undefined): NormalizedCREP {
  if (typeof x === 'number') {
    const score = clamp(x) ?? 0;
    return { score, parts: {} };
  }
  const parts = {
    c: clamp(x?.coherence),
    r: clamp(x?.resonance),
    e: clamp(x?.emergence),
    p: clamp(x?.poetics)
  };
  const values = Object.values(parts).filter((v): v is number => typeof v === 'number');
  const score = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  return { score, parts };
}

export function toBadge(score: number): 'low' | 'med' | 'high' | 'ultra' {
  if (score >= 0.75) return 'ultra';
  if (score >= 0.5) return 'high';
  if (score >= 0.25) return 'med';
  return 'low';
}
