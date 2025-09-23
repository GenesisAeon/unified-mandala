const DEFAULT_NATS_URLS = Object.freeze(['nats://localhost:4222']);
export const DEFAULT_COSMIC_SUBJECT = 'demo.cosmic';

function normalizeEntries(value) {
  return String(value)
    .split(/[\,\s]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseNatsServers(source = process.env.NATS_URL) {
  let entries = [];

  if (Array.isArray(source)) {
    entries = source.flatMap((item) => normalizeEntries(item));
  } else if (typeof source === 'string' && source.length > 0) {
    entries = normalizeEntries(source);
  }

  return entries.length > 0 ? entries : [...DEFAULT_NATS_URLS];
}

export function resolveCosmicSubject(value = process.env.COSMIC_SUBJECT) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  } else if (value != null) {
    const normalized = String(value).trim();
    if (normalized.length > 0) return normalized;
  }
  return DEFAULT_COSMIC_SUBJECT;
}

export function resolveCosmicQueue(value = process.env.COSMIC_QUEUE) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

export function describeServers(servers) {
  return servers.length > 1 ? servers.join(', ') : servers[0];
}
