import { loadConversations } from './conversationAnalyzer';

/**
 * Extracts message contents after the first occurrence of an anchor string.
 * @param filePath Path to conversations JSON array.
 * @param anchor Anchor text to search for (case-insensitive).
 */
export function extractMessagesAfterAnchor(filePath: string, anchor: string): string[] {
  const convs = loadConversations(filePath);
  const anchorRe = new RegExp(anchor, 'i');
  const collected: string[] = [];

  for (const conv of convs) {
    const nodes = Object.values(conv.mapping)
      .filter(n => n.message)
      .sort((a, b) => ((a as any).message?.create_time || 0) - ((b as any).message?.create_time || 0));
    let anchorFound = false;
    for (const node of nodes) {
      const parts = (node as any).message?.content?.parts || [];
      const text = parts.join('\n');
      if (!anchorFound) {
        if (anchorRe.test(text)) {
          anchorFound = true;
        }
        continue;
      }
      if (anchorFound && text.trim() !== '') {
        collected.push(text.trim());
      }
    }
  }

  return collected;
}
