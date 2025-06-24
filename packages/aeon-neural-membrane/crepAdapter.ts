export interface CREPSignature {
  coherence: number;
  resonance: number;
  emergence: number;
  poetics: number;
}

/** Berechnet einen Lernfaktor basierend auf CREP-Werten. */
export function crepLearningFactor(crep: CREPSignature, base = 0.1): number {
  const avg =
    (crep.coherence + crep.resonance + crep.emergence + crep.poetics) / 40;
  return base * (0.5 + avg);
}
