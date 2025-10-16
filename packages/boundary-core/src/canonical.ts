type Seen = WeakSet<object>;

function normalize(value: unknown, seen: Seen): unknown {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      return String(value);
    }
    return value ?? null;
  }

  if (seen.has(value as object)) {
    return '[Circular]';
  }
  seen.add(value as object);

  if (Array.isArray(value)) {
    return (value as Array<unknown>).map((entry) => normalize(entry, seen));
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const normalized: Record<string, unknown> = {};
  for (const [key, val] of entries) {
    const normalizedValue = normalize(val, seen);
    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }
  return normalized;
}

export function canonicalizePayload(payload: unknown): string {
  const seen: Seen = new WeakSet();
  try {
    const normalized = normalize(payload ?? null, seen);
    return JSON.stringify(normalized);
  } catch (error) {
    try {
      return JSON.stringify(String(payload ?? ''));
    } catch {
      return '"[Unserializable]"';
    }
  }
}
