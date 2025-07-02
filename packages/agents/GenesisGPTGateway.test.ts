import { GenesisGPTGateway } from './GenesisGPTGateway';

describe('GenesisGPTGateway', () => {
  it('fetches share link', async () => {
    const text = 'response data';
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, status: 200, text: jest.fn().mockResolvedValue(text) });
    const agent = new GenesisGPTGateway({ fetch: mockFetch as any });
    await agent.handle({ id: '1', description: 'test', shareLink: 'http://example.com' });
    expect(mockFetch).toHaveBeenCalledWith('http://example.com');
  });
});
