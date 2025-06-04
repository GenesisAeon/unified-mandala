import { SigillinGenerator } from './SigillinGenerator';

it('throws on invalid type', () => {
  expect(() => SigillinGenerator('x', 'invalid-type' as any, 'draft', 't')).toThrow();
});
