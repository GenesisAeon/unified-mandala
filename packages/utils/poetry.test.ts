import { toSigilVerse } from './poetry';
import * as synapse from '../gpt-bridges/aeon-gpt-synapse';

jest.spyOn(synapse, 'sendToGPT').mockResolvedValue('Ein Vers');

test('generates verse from error message', async () => {
  const verse = await toSigilVerse('Fehler');
  expect(synapse.sendToGPT).toHaveBeenCalled();
  expect(verse).toBe('Ein Vers');
});
