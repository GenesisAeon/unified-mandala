import { loadSymbolphasen } from '../packages/shared-utils/loadSymbolphasen';

it('loads phase data from yaml', () => {
  const data = loadSymbolphasen();
  expect(data.morgen.phase).toBe('Initiation');
});
