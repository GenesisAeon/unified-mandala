import { SigillinGenerator } from './SigillinGenerator';

test('SigillinGenerator erzeugt gültige Sigillin', () => {
  const sig = SigillinGenerator('test', 'poetic-root', 'draft', 'TestGPT');
  expect(sig.id).toBe('test');
  expect(sig.status).toBe('draft');
  expect(sig.type).toBe('poetic-root');
});
