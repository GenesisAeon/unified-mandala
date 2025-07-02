import { storeSigillin } from './SigillinBlockchainIntegration';

test('stores sigil', () => {
  expect(storeSigillin('abc')).toBe('stored:abc');
});
