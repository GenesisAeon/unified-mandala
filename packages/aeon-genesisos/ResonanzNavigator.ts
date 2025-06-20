import { SigillinParser } from '../genesis-sigillin-core/SigillinParser';

export class ResonanzNavigator {
  private signatures: string[] = [];
  private archetypeMap: Record<string, string> = {};

  update(zip: Buffer): void {
    const { signature } = SigillinParser(zip);
    this.signatures.push(signature);
  }

  defineArchetype(signature: string, archetype: string): void {
    this.archetypeMap[signature] = archetype;
  }

  current(): string | undefined {
    return this.signatures[this.signatures.length - 1];
  }

  currentArchetype(): string | undefined {
    const sig = this.current();
    return sig ? this.archetypeMap[sig] : undefined;
  }
}
