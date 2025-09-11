export type EmergenceClass = "low" | "medium" | "high";
export function emergenceClass(v: number): EmergenceClass {
  if (v >= 0.75) return "high";
  if (v >= 0.4) return "medium";
  return "low";
}
