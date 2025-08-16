import { CommunityPluginMarketplace } from './CommunityPluginMarketplace';

test('rates plugins', () => {
  const m = new CommunityPluginMarketplace();
  m.add('p', 3);
  m.rate('p', 5);
  expect(m.list()).toEqual([{ name: 'p', rating: 5 }]);
});
