import { AttributionIndex } from './AttributionIndex';

test('stores attribution entries per artifact', () => {
  const index = new AttributionIndex();
  index.add({ artifact: 'fileA', actor: 'alice', share: 0.6, license: 'MIT' });
  index.add({ artifact: 'fileA', actor: 'bob', share: 0.4 });
  index.add({ artifact: 'fileB', actor: 'carol', share: 1 });

  expect(index.get('fileA')).toHaveLength(2);
  expect(index.get('fileA')[0]).toMatchObject({ actor: 'alice', share: 0.6, license: 'MIT' });
  expect(index.get('fileB')).toEqual([
    { artifact: 'fileB', actor: 'carol', share: 1 }
  ]);
});

