import { SigilManager } from '../shared-utils/SigilManager';

export class CosmicTheoryAgentWithSigil {
  constructor(private sigilManager: SigilManager) {}

  analyze(text: string) {
    const sigil = this.sigilManager.currentSigil();
    return `${sigil}: ${text}`;
  }
}
