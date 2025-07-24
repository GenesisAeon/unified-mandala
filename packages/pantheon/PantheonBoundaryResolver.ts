export class PantheonBoundaryResolver {
  resolve(pantheonRules: string[], boundaryRules: string[]): string[] {
    const set = new Set([...pantheonRules, ...boundaryRules]);
    return Array.from(set);
  }
}
