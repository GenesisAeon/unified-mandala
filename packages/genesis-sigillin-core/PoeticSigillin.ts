export interface PoeticSigil {
  id: string;
  verse: string;
}

/**
 * Generate a simple poetic sigil id based on a verse snippet.
 */
export function createPoeticSigil(verse: string): PoeticSigil {
  const base = verse.trim().split(/\s+/).slice(0, 3).join('-');
  const id = 'poetic-' + Buffer.from(base).toString('hex').slice(0, 8);
  return { id, verse };
}
