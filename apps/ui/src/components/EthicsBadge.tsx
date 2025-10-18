import type { FC } from 'react';

type Verdict = 'green' | 'yellow' | 'red' | 'unknown';

interface EthicsBadgeProps {
  verdict?: Verdict;
  evidenceCount?: number;
  compact?: boolean;
}

const labelMap: Record<Verdict, string> = {
  green: 'VERIFIED',
  yellow: 'PARTIAL',
  red: 'BLOCKED',
  unknown: 'UNVERIFIED',
};

const colorMap: Record<Verdict, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  unknown: 'bg-slate-400',
};

export const EthicsBadge: FC<EthicsBadgeProps> = ({ verdict = 'unknown', evidenceCount = 0, compact = false }) => {
  const color = colorMap[verdict] ?? colorMap.unknown;
  const label = labelMap[verdict] ?? labelMap.unknown;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-white shadow-sm transition ${color}`}
      aria-label={`Ethics verdict ${label}`}
    >
      <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
      <span className={`opacity-90 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {evidenceCount} evidence{evidenceCount === 1 ? '' : 's'}
      </span>
    </div>
  );
};

export default EthicsBadge;
