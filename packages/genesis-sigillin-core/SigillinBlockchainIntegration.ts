export interface SigillinRecord {
  id: string;
  data: string;
}

export interface BlockchainAdapter {
  persist(record: SigillinRecord): Promise<string>;
}

export class InMemoryBlockchain implements BlockchainAdapter {
  private ledger: SigillinRecord[] = [];

  async persist(record: SigillinRecord): Promise<string> {
    this.ledger.push(record);
    return `tx-${this.ledger.length}`;
  }

  get records(): SigillinRecord[] {
    return this.ledger;
  }
}

export async function storeSigillin(
  record: SigillinRecord,
  adapter: BlockchainAdapter
): Promise<string> {
  return adapter.persist(record);
}
