import { interpret } from './GPTSymbolInterpreter';

test('interprets known symbols locally', async () => {
  await expect(interpret('🔥')).resolves.toBe('energy');
});

test('fetches meaning for unknown symbols', async () => {
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ meaning: 'mystery' }),
    })
  );

  const res = await interpret('🔮', mockFetch as any);
  expect(mockFetch).toHaveBeenCalled();
  expect(res).toBe('mystery');
});
