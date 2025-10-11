import type { Strength } from '@epistemic/bayes';

export function ConfidenceSigil({ strength }: { strength: Strength }) {
  const map = {
    inconclusive: { emoji: '🌀', cls: 'text-gray-600' },
    weak: { emoji: '🎲', cls: 'text-amber-700' },
    moderate: { emoji: '📈', cls: 'text-sky-700' },
    strong: { emoji: '🛡️', cls: 'text-emerald-700' },
    decisive: { emoji: '🏅', cls: 'text-indigo-700' },
  }[strength];
  return <span className={`text-lg ${map.cls}`}>{map.emoji}</span>;
}
