import type { SigilMessage } from '../sigil/protocols';

export function calculateResonance(sigils: SigilMessage[]): number {
  if (!sigils.length) return 0;
  const intents = sigils.map((s) => s.intent ?? 'assert');
  const counts = new Map<string, number>();
  for (const i of intents) counts.set(i, (counts.get(i) ?? 0) + 1);
  const n = intents.length;
  const k = counts.size;
  if (k <= 1) return 1;
  const entropy = Array.from(counts.values()).reduce(
    (sum, c) => sum - (c / n) * Math.log2(c / n),
    0,
  );
  const res = 1 - entropy / Math.log2(k);
  return isFinite(res) ? Math.max(0, Math.min(1, res)) : 0;
}

export function resonanceToSigil(r: number): SigilMessage {
  const symbol = r >= 0.8 ? '🟢' : r >= 0.5 ? '🟠' : '🔴';
  return {
    symbol,
    intent: 'assert',
    context: { metric: 'crep.resonance', value: r },
    metadata: { source: 'crep.kernel', timestamp: new Date().toISOString() },
  };
}
