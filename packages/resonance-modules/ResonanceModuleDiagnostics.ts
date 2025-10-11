export class ResonanceModuleDiagnostics {
  analyze(modules: { id: string }[]): Record<string, string> {
    const result: Record<string, string> = {};
    modules.forEach((m) => {
      result[m.id] = 'ok';
    });
    return result;
  }
}
