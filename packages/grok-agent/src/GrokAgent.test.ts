import { GrokAgent, PhenomenonData } from './GrokAgent';

const agent = new GrokAgent();

test('discover filters unsafe signatures', async () => {
  const mockPost = jest.spyOn(require('axios'), 'post').mockResolvedValue({
    data: { rules: [{ signature: 'safe', metadata: {} }] }
  });
  const result = await agent.discover([{ id: '1', payload: {} } as PhenomenonData]);
  expect(result[0].signature).toBe('safe');
  mockPost.mockRestore();
});
