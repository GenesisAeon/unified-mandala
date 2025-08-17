export interface TextChunk {
  text: string;
  start: number;
  end: number;
}

/**
 * Splits input text into token chunks with overlap.
 * @param text Input text to chunk.
 * @param chunkSize Maximum number of tokens per chunk.
 * @param overlap Number of tokens shared between consecutive chunks.
 */
export function chunkText(text: string, chunkSize: number, overlap = 0): TextChunk[] {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be positive');
  }
  if (overlap >= chunkSize) {
    throw new Error('overlap must be smaller than chunkSize');
  }
  const tokens = text.split(/\s+/).filter(Boolean);
  const chunks: TextChunk[] = [];
  let index = 0;
  while (index < tokens.length) {
    const end = Math.min(tokens.length, index + chunkSize);
    const chunkTokens = tokens.slice(index, end);
    chunks.push({ text: chunkTokens.join(' '), start: index, end });
    if (end === tokens.length) break;
    index = end - overlap;
  }
  return chunks;
}
