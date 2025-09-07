import type { ResonanceLevel, ResonanceResult } from "./types";

/** Numerisch stabile Entropie-Berechnung (Shannon-ähnlich, log2). */
export function computeEntropy(values: number[]): number {
  const eps = 1e-12;
  const clamped = values.map(v => (isFinite(v) ? Math.max(0, v) : 0));
  const sum = clamped.reduce((a, b) => a + b, 0);
  const norm = sum > 0 ? clamped.map(v => v / sum) : values.map(_ => 0); // all zeros -> entropy 0
  let h = 0;
  for (const p of norm) {
    if (p > eps) h -= p * Math.log2(p);
  }
  return h;
}

/** Einfache Schwellen-Logik (v1): <1.2🟢, <2.0🟠, sonst 🔴 */
export function classify(entropy: number): ResonanceLevel {
  if (entropy < 1.2) return "green";
  if (entropy < 2.0) return "amber";
  return "red";
}

export function evaluate(values: number[]): ResonanceResult {
  const entropy = computeEntropy(values);
  return { entropy, level: classify(entropy), n: values.length };
}
