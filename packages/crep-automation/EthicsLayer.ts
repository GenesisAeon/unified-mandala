const DEFAULT_PROHIBITED = ['violence', 'hate'];

export function containsProhibited(text: string, words: string[] = DEFAULT_PROHIBITED): boolean {
  const lower = text.toLowerCase();
  return words.some(w => lower.includes(w));
}
