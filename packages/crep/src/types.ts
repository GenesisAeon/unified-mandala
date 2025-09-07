export type ResonanceLevel = "green" | "amber" | "red";

export interface ResonanceResult {
  entropy: number;   // Shannon-ähnlich, log2
  level: ResonanceLevel;
  n: number;         // Anzahl Messwerte
}
