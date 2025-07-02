import { SimHostCore, SimulationModule } from './SimHostCore';

test('runs registered modules', () => {
  const core = new SimHostCore();
  const results: number[] = [];
  const mod: SimulationModule = { run: () => { results.push(1); return 1; } };
  core.register(mod);
  expect(core.runAll()).toEqual([1]);
  expect(results).toEqual([1]);
});
