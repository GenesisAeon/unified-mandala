export interface EthicsOptions {
  /** Words that should not appear in the text */
  bannedWords?: string[];
  /** Regular expression patterns that flag unethical content */
  bannedPatterns?: RegExp[];
}

export function isEthical(text: string, options: EthicsOptions = {}): boolean {
  const { bannedWords = [], bannedPatterns = [] } = options;
  const lower = text.toLowerCase();
  if (bannedWords.some(w => lower.includes(w.toLowerCase()))) {
    return false;
  }
  if (bannedPatterns.some(p => p.test(text))) {
    return false;
  }
  return true;
}
