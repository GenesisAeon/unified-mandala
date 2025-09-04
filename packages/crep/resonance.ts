import type { SigilMessage, SigilIntent } from "../sigil/protocols";

export function resonanceFromIntents(intents: SigilIntent[]): number {
  if (intents.length === 0) return 0;
  const counts = new Map<SigilIntent, number>();
  for (const i of intents) counts.set(i, (counts.get(i) || 0) + 1);
  const probs: number[] = [];
  counts.forEach(c => probs.push(c / intents.length));
  const H = probs.reduce((s, p) => s - (p > 0 ? p * Math.log2(p) : 0), 0);
  const Hmax = Math.log2(counts.size || 1);
  const res = Hmax === 0 ? 1 : (1 - H / Hmax);
  return Number(Math.max(0, Math.min(1, res)).toFixed(3));
}

export function calculateResonance(sigils: SigilMessage[]): number {
  const intents = sigils.map(s => s.intent);
  return resonanceFromIntents(intents);
}

export function resonanceToSigil(r: number): string {
  if (r >= 0.8) return "🔔";   // hohe Kohärenz
  if (r >= 0.5) return "✨";   // mittel
  if (r >= 0.2) return "🫧";   // niedrig
  return "🌀";                 // sehr niedrig/chaotisch
}
