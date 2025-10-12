// src/domain/crep.ts

export type CrepPartsLoose =
  | number
  | string
  | {
      score?: number | string;
      coherence?: number | string;
      resonance?: number | string;
      emergence?: number | string;
      poetics?: number | string;
      C?: number | string;
      R?: number | string;
      E?: number | string;
      P?: number | string;
      crep?: any;
    }
  | null
  | undefined;

export type CrepNormalized = {
  score: number; // 0..1
  parts: {
    c?: number;
    r?: number;
    e?: number;
    p?: number;
  };
  source: 'score' | 'lowercase' | 'uppercase' | 'derived' | 'none';
};

function toNum(v: any): number | undefined {
  if (v == null) return undefined;
  const n = typeof v === 'string' ? Number(v.trim()) : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * normalizeCREP akzeptiert alle in deinem Repo vorkommenden Formen:
 * - number (direkter Score 0..1)
 * - string "0.87"
 * - object mit score
 * - object mit lowercase-keys {coherence,resonance,emergence,poetics}
 * - object mit uppercase-keys {C,R,E,P}
 * - object mit verschachteltem .crep (jede der obigen Formen)
 * - fällt ansonsten auf "derived" (Durchschnitt vorhandener Teile) zurück
 */
export function normalizeCREP(input: CrepPartsLoose): CrepNormalized {
  const direct = toNum(input as any);
  if (direct !== undefined) {
    return { score: clamp01(direct), parts: {}, source: 'score' };
  }

  if (typeof input === 'object' && input) {
    if ('crep' in input && (input as any).crep != null) {
      const nested = normalizeCREP((input as any).crep);
      if (nested.source !== 'none') return nested;
    }

    const maybeScore = toNum((input as any).score);
    if (maybeScore !== undefined) {
      return { score: clamp01(maybeScore), parts: {}, source: 'score' };
    }

    const lc = {
      c: toNum((input as any).coherence),
      r: toNum((input as any).resonance),
      e: toNum((input as any).emergence),
      p: toNum((input as any).poetics),
    };
    const lcPresent = [lc.c, lc.r, lc.e, lc.p].filter((x) => x !== undefined) as number[];
    if (lcPresent.length > 0) {
      const lcClamped = [lc.c, lc.r, lc.e, lc.p]
        .filter((x) => x !== undefined)
        .map((x) => clamp01(x as number));
      const avg = lcClamped.reduce((a, b) => a + b, 0) / lcClamped.length;
      return {
        score: avg,
        parts: {
          c: lc.c !== undefined ? clamp01(lc.c) : undefined,
          r: lc.r !== undefined ? clamp01(lc.r) : undefined,
          e: lc.e !== undefined ? clamp01(lc.e) : undefined,
          p: lc.p !== undefined ? clamp01(lc.p) : undefined,
        },
        source: 'lowercase',
      };
    }

    const uc = {
      c: toNum((input as any).C),
      r: toNum((input as any).R),
      e: toNum((input as any).E),
      p: toNum((input as any).P),
    };
    const ucPresent = [uc.c, uc.r, uc.e, uc.p].filter((x) => x !== undefined) as number[];
    if (ucPresent.length > 0) {
      const ucClamped = [uc.c, uc.r, uc.e, uc.p]
        .filter((x) => x !== undefined)
        .map((x) => clamp01(x as number));
      const avg = ucClamped.reduce((a, b) => a + b, 0) / ucClamped.length;
      return {
        score: avg,
        parts: {
          c: uc.c !== undefined ? clamp01(uc.c) : undefined,
          r: uc.r !== undefined ? clamp01(uc.r) : undefined,
          e: uc.e !== undefined ? clamp01(uc.e) : undefined,
          p: uc.p !== undefined ? clamp01(uc.p) : undefined,
        },
        source: 'uppercase',
      };
    }
  }

  return { score: 0, parts: {}, source: 'none' };
}
