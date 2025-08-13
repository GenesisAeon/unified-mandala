const mapping: Record<string, string> = {
  '🔥': 'energy',
  '💧': 'flow',
};

/**
 * Interpret a symbolic glyph. Known symbols are resolved locally while
 * unknown symbols are sent to a GPT bridge which returns a textual meaning.
 *
 * The fetch implementation is injectable to keep the module testable without
 * performing real network requests.
 */
export async function interpret(
  symbol: string,
  fetchImpl?: typeof fetch
): Promise<string> {
  if (mapping[symbol]) return mapping[symbol];

  const endpoint =
    process.env.GPT_SYMBOL_URL || 'http://localhost:3000/symbol-interpret';
  const fn = fetchImpl || (globalThis as any).fetch;
  try {
    const res = await fn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    });

    if (!res.ok) return 'unknown';
    const data = (await res.json()) as { meaning?: string };
    return data.meaning || 'unknown';
  } catch {
    return 'unknown';
  }
}

export { mapping };
