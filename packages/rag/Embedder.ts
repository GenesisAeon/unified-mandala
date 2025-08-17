import crypto from 'crypto';

export interface Embedder {
  /**
   * Generate a vector embedding for the given text.
   */
  embed(text: string): Promise<number[]>;
}

/**
 * LocalHasher provides a deterministic embedding based on SHA256 hashing.
 * Useful as a lightweight fallback when no external embedding service is
 * available.
 */
export class LocalHasher implements Embedder {
  constructor(private dimensions = 256) {}

  async embed(text: string): Promise<number[]> {
    const hash = crypto.createHash('sha256').update(text).digest();
    const vector: number[] = [];
    for (let i = 0; i < this.dimensions; i++) {
      vector[i] = hash[i % hash.length] / 255;
    }
    return vector;
  }
}

/**
 * OpenAIEmbedder calls the OpenAI embeddings API. If no API key is set or the
 * request fails it throws, allowing callers to fallback to LocalHasher.
 */
export class OpenAIEmbedder implements Embedder {
  constructor(private apiKey = process.env.OPENAI_API_KEY) {}

  async embed(text: string): Promise<number[]> {
    if (!this.apiKey) throw new Error('Missing OPENAI_API_KEY');
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });
    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }
    const json: any = await res.json();
    const embedding = json?.data?.[0]?.embedding;
    if (!Array.isArray(embedding)) {
      throw new Error('Invalid embedding response');
    }
    return embedding.map((v: number) => Number(v));
  }
}

/**
 * Helper to create an embedder with automatic fallback to LocalHasher.
 */
export function createEmbedder(): Embedder {
  const local = new LocalHasher();
  const openai = new OpenAIEmbedder();
  return {
    async embed(text: string) {
      try {
        return await openai.embed(text);
      } catch {
        return await local.embed(text);
      }
    },
  };
}
