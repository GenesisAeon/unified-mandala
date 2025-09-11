import type { Evidence } from "./evidence";
export type Strength = "inconclusive"|"weak"|"moderate"|"strong"|"decisive";

export function bayesFactor(evs: Evidence[]): number {
  let pro = 1, contra = 1;
  for (const e of evs) {
    const w = Math.max(1e-6, Math.min(1, e.support * e.quality));
    if (e.counter) contra *= w; else pro *= w;
  }
  return pro / Math.max(1e-6, contra);
}
export function jeffreys(bf: number): Strength {
  if (bf < 1) return "inconclusive";
  if (bf < 3) return "weak";
  if (bf < 10) return "moderate";
  if (bf < 30) return "strong";
  return "decisive";
}
