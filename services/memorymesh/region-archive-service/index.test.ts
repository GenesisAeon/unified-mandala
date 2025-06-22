import { RegionArchive } from './index';

test('logs and retrieves messages', () => {
  const ra = new RegionArchive();
  ra.log('EU', 'hello');
  ra.log('EU', 'world');
  expect(ra.list('EU')).toEqual(['hello', 'world']);
});
