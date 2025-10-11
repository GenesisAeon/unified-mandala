export interface ConvoMemory {
  text: string;
  crepSignature: {
    coherence: number;
    resonance: number;
    emergence: number;
    poetics: number;
  };
}

/**
 * Extracts a simple conversation memory and returns a pseudo CREP signature.
 */
export function extractConvoMemory(conversation: string): ConvoMemory {
  const text = conversation.replace(/\n+/g, ' ').trim();
  const len = text.length || 1;
  return {
    text,
    crepSignature: {
      coherence: Math.min(10, len % 10),
      resonance: Math.min(10, (len >> 1) % 10),
      emergence: Math.min(10, (len >> 2) % 10),
      poetics: Math.min(10, (len >> 3) % 10),
    },
  };
}
