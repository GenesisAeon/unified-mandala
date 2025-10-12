export function sanitizeInput(text: string): string | null {
  if (/\battack\b/i.test(text)) return null;
  return text;
}

