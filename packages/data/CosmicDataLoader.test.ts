import { loadCMBMap, loadNeutrinoFlux } from './CosmicDataLoader';

test('loads CMB map', async () => {
  const map = await loadCMBMap();
  expect(map.temperature[0]).toBeCloseTo(2.7);
});

test('loads neutrino flux', async () => {
  const flux = await loadNeutrinoFlux();
  expect(flux.energy[0]).toBe(1);
});
