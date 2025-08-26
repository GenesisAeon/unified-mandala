export interface Contribution {
  actor: string;
  lines: number;
  weight?: number;
}

/**
 * CreditLedger tracks contribution weights per actor.
 * Lines are multiplied by an optional weight to allow
 * lightweight attribution accounting for hybrid teams.
 */
export class CreditLedger {
  private readonly ledger: Record<string, number> = {};

  addContribution(entry: Contribution): void {
    const weight = entry.weight ?? 1;
    const prev = this.ledger[entry.actor] ?? 0;
    this.ledger[entry.actor] = prev + entry.lines * weight;
  }

  totalFor(actor: string): number {
    return this.ledger[actor] ?? 0;
  }

  summary(): Record<string, number> {
    return { ...this.ledger };
  }
}

