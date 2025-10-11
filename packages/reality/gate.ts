export type RealityDecision = 'external' | 'ambiguous' | 'imaginative';

export interface RealityInputs {
  evidenceStrength: number; // 0..1  (SNR, replication, signature checks)
  priorConfidence: number; // 0..1  (model/agent certainty)
  provenance: number; // 0..1  (chain-of-custody, source trust)
}

export interface RealityResult {
  score: number; // 0..1
  decision: RealityDecision;
}

export const defaultThresholds = {
  external: 0.7,
  ambiguous: 0.45,
};

export function realityScore(x: RealityInputs, t = defaultThresholds): RealityResult {
  // Evidence-led blend; prior supports but cannot dominate
  const s =
    0.6 * clamp01(x.evidenceStrength) +
    0.3 * clamp01(x.provenance) +
    0.1 * clamp01(x.priorConfidence);

  const decision: RealityDecision =
    s >= t.external ? 'external' : s >= t.ambiguous ? 'ambiguous' : 'imaginative';

  return { score: s, decision };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
