import clsx from 'clsx';

type Props = {
  enabled: boolean;
  A: number | undefined;
  dA: number | undefined;
  state: 'subcritical' | 'apparent' | 'event';
};

export function MembranePill({ enabled, A, dA, state }: Props) {
  if (!enabled) return null;
  const tone =
    state === 'event' ? 'bg-red-600' : state === 'apparent' ? 'bg-amber-500' : 'bg-emerald-600';
  const formattedA = typeof A === 'number' ? A.toFixed(2) : '–';
  const formattedDelta = typeof dA === 'number' ? `${dA >= 0 ? '+' : ''}${dA.toFixed(2)}` : '–';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-white text-sm font-medium shadow-sm transition-colors',
        tone,
      )}
      title={`A=${formattedA} ΔA=${formattedDelta}`}
      aria-live="polite"
    >
      {state.toUpperCase()} · A={formattedA} · ΔA={formattedDelta}
    </span>
  );
}

export default MembranePill;
