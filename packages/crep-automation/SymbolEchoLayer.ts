export function detectSymbols(text: string): string[] {
  return (text.match(/#[A-Za-z0-9_-]+/g) || []).map((s) => s.slice(1));
}

export function generateEcho(symbols: string[]): string {
  return symbols.map((s) => `${s}!`).join(' ');
}
