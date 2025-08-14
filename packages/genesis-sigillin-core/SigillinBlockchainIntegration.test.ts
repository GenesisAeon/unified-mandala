import {
  InMemoryBlockchain,
  storeSigillin,
  type SigillinRecord,
} from './SigillinBlockchainIntegration';

test('stores sigil on blockchain', async () => {
  const chain = new InMemoryBlockchain();
  const record: SigillinRecord = { id: 'sig-1', data: 'abc' };
  const tx = await storeSigillin(record, chain);
  expect(tx).toBe('tx-1');
  expect(chain.records[0]).toEqual(record);
});
