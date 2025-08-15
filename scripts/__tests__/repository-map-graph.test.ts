import { repositoryMapToDot } from '../repository-map-graph';

test('generates graphviz dot from repository map', () => {
  const dot = repositoryMapToDot();
  expect(dot).toContain('digraph RepositoryMap');
  expect(dot).toContain('"aeon"');
  expect(dot).toContain('"codex-sync.sh"');
});
