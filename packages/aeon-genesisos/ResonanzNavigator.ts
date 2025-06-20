import { SigillinParser } from '../genesis-sigillin-core/SigillinParser';

export class ResonanzNavigator {
  private signatures: string[] = [];

  update(zip: Buffer): void {
    const { signature } = SigillinParser(zip);
    this.signatures.push(signature);
  }

  current(): string | undefined {
    return this.signatures[this.signatures.length - 1];
  }
}
