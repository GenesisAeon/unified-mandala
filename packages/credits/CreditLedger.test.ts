import { CreditLedger } from './CreditLedger';

test('aggregates weighted contributions per actor', () => {
  const ledger = new CreditLedger();
  ledger.addContribution({ actor: 'alice', lines: 10 });
  ledger.addContribution({ actor: 'bob', lines: 5, weight: 2 });
  ledger.addContribution({ actor: 'alice', lines: 3, weight: 0.5 });

  expect(ledger.totalFor('alice')).toBe(10 + 3 * 0.5);
  expect(ledger.totalFor('bob')).toBe(5 * 2);
  expect(ledger.summary()).toEqual({ alice: 11.5, bob: 10 });
});
