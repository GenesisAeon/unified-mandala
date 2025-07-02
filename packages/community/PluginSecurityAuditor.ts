export function auditPlugin(plugin: { code: string }): boolean {
  return !plugin.code.includes('dangerous');
}
