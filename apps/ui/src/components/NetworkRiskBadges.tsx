import type { FC } from 'react';
import type { NetworkSignals, RiskLevel } from '../lib/fetchWithEthics';

type BadgeDescriptor = {
  key: string;
  label: string;
  level: RiskLevel;
  title?: string;
};

const colorByLevel: Record<RiskLevel, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warn: 'bg-amber-50 text-amber-800 border-amber-300',
  critical: 'bg-rose-50 text-rose-800 border-rose-300',
};

function buildBadges(signals: NetworkSignals): BadgeDescriptor[] {
  const badges: BadgeDescriptor[] = [];
  badges.push({
    key: 'ttl',
    label: `TTL ${Math.max(0, Math.round(signals.ttl.seconds))}s`,
    level: signals.ttl.level,
    title:
      signals.ttl.level === 'critical'
        ? 'TTL < 10s – hohe Rebind-Gefahr'
        : signals.ttl.level === 'warn'
          ? 'TTL < 30s – beobachten'
          : 'TTL stabil',
  });

  badges.push({
    key: 'redirect',
    label: signals.redirect.hops === 1 ? '1 redirect' : `${signals.redirect.hops} redirects`,
    level: signals.redirect.level,
    title:
      signals.redirect.level === 'critical'
        ? '≥3 Redirect-Hops – untersuchen'
        : signals.redirect.level === 'warn'
          ? 'Redirect-Kette aktiv'
          : 'Keine Redirects',
  });

  if (signals.tls) {
    badges.push({
      key: 'tls',
      label: signals.tls.level === 'ok' ? 'TLS OK' : 'TLS mismatch',
      level: signals.tls.level,
      title: signals.tls.level === 'ok'
        ? 'SAN geprüft & Remote-IP passt'
        : signals.tls.ipMismatch
          ? `Remote ${signals.tls.remoteIp ?? 'unknown'} ≠ pinned ${signals.tls.pinnedIp ?? 'unknown'}`
          : 'SAN Validierung fehlgeschlagen',
    });
  }

  return badges;
}

export const NetworkRiskBadges: FC<{ signals?: NetworkSignals | null }> = ({ signals }) => {
  if (!signals) {
    return null;
  }

  const badges = buildBadges(signals);
  if (!badges.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition ${colorByLevel[badge.level]}`}
          title={badge.title}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default NetworkRiskBadges;
