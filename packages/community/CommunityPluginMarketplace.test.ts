import { CommunityPluginMarketplace } from './CommunityPluginMarketplace';

test('stores plugins', () => {
  const m = new CommunityPluginMarketplace();
  m.add('p');
  expect(m.list()).toEqual(['p']);
});
