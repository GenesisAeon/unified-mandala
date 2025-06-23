import { generateOverlay } from '../generativeOverlay';

test('returns overlay filename', async () => {
  const result = await generateOverlay({});
  expect(result).toBe('overlay.png');
});
