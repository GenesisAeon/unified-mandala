import type { FC } from 'react';

type EvidenceStrength = 'weak' | 'strong' | 'standard';

export interface EvidenceChipItem {
  url: string;
  domain: string;
  strength?: EvidenceStrength;
}

function isStrong(strength?: EvidenceStrength): boolean {
  return strength === 'strong';
}

export const EvidenceChips: FC<{ evidence: EvidenceChipItem[] }> = ({ evidence }) => {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    return null;
  }
  const domains = new Set(evidence.map((item) => item.domain).filter(Boolean));
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-700">
        {domains.size || 0} domains
      </span>
      {evidence.map((item, index) => {
        const domainLabel = item.domain || 'unknown';
        const strong = isStrong(item.strength);
        return (
          <span
            key={`${domainLabel}-${index}`}
            title={item.url}
            className={`px-2 py-1 rounded-full border text-xs ${
              strong
                ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {domainLabel}
            {strong ? ' • strong' : ''}
          </span>
        );
      })}
    </div>
  );
};
