export function checkIntegrity(sig: string): boolean {
  return sig.includes('sigil');
}
