import { AeonSigillinVault, PoeticState } from './AeonSigillinVault';

test('records transitions and resonances', () => {
  const state: PoeticState = { id: '1', timestamp: 'now', content: 'hi' };
  AeonSigillinVault.record(state);
  AeonSigillinVault.recordTransition(state);
  AeonSigillinVault.recordResonance(state);
  expect(AeonSigillinVault.latest(1)).toEqual([state]);
  expect(AeonSigillinVault.getTransitions(1)).toEqual([state]);
  expect(AeonSigillinVault.getResonances(1)).toEqual([state]);
});
