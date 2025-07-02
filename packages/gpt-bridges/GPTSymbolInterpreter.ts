const mapping: Record<string, string> = {
  '🔥': 'energy',
  '💧': 'flow',
};

export function interpret(symbol: string): string {
  return mapping[symbol] || 'unknown';
}
