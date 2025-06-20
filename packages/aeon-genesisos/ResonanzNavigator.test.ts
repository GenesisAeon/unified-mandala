import { gzipSync } from 'zlib';
import YAML from 'yaml';
import { ResonanzNavigator } from './ResonanzNavigator';

it('updates current signature from zipped sigillin', () => {
  const yaml = YAML.stringify({ id: 't1' });
  const zip = gzipSync(Buffer.from(yaml));
  const nav = new ResonanzNavigator();
  nav.update(zip);
  expect(nav.current()).toBeDefined();
});

it('maps archetype to current signature', () => {
  const yaml = YAML.stringify({ id: 't2' });
  const zip = gzipSync(Buffer.from(yaml));
  const nav = new ResonanzNavigator();
  nav.update(zip);
  const sig = nav.current()!;
  nav.defineArchetype(sig, 'alpha');
  expect(nav.currentArchetype()).toBe('alpha');
});
