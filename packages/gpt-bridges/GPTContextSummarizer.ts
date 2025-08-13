/**
 * Create a short contextual summary without cutting words in half.
 * If the text exceeds the limit, the result is truncated to the last full word
 * that fits within the limit and an ellipsis is appended.
 */
export function summarize(text: string, limit = 100): string {
  if (text.length <= limit) return text;
  const words = text.split(/\s+/);
  let out = '';
  for (const w of words) {
    const candidate = out ? out + ' ' + w : w;
    if (candidate.length > limit) break;
    out = candidate;
  }
  return out + '…';
}
