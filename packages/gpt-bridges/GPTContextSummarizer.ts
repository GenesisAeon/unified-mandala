export function summarize(text: string, limit = 100): string {
  return text.length <= limit ? text : text.slice(0, limit) + '...';
}
