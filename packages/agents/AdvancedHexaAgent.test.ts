import { AdvancedHexaAgent } from './AdvancedHexaAgent';

test('process returns research result', async () => {
  const agent = new AdvancedHexaAgent();
  const res = await agent.process(['resonanz'], 'KI');
  expect(res.research).toContain('KI');
});
