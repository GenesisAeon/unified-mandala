export function integrateShadow(data: string, key = 42): string {
  const obfuscated = Array.from(data)
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) ^ key))
    .join('');
  return Buffer.from(obfuscated, 'binary').toString('base64');
}

export function extractShadow(encoded: string, key = 42): string {
  const decoded = Buffer.from(encoded, 'base64').toString('binary');
  return Array.from(decoded)
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) ^ key))
    .join('');
}
