import { createPoeticSigil } from '../PoeticSigillin';

test('creates poetic sigil id', () => {
  const sigil = createPoeticSigil('echo of the void');
  expect(sigil.id.startsWith('poetic-')).toBe(true);
  expect(sigil.verse).toBe('echo of the void');
});
