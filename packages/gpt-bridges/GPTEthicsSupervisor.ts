export function isEthical(text: string, banned: string[] = []): boolean {
  return !banned.some(w => text.includes(w));
}
