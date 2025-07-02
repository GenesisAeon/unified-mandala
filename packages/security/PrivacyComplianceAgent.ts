export function checkCompliance(fields: string[], allowed: string[]): boolean {
  return fields.every(f => allowed.includes(f));
}
