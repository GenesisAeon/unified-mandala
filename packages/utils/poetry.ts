import { sendToGPT } from '../gpt-bridges/aeon-gpt-synapse';
import { GPTRole } from '../gpt-bridges/gptRoles';

/**
 * Generate a short sigil verse for the provided error message using GPT.
 */
export async function toSigilVerse(errorMessage: string): Promise<string> {
  const prompt = `Fasse den folgenden Fehler in zwei poetischen Zeilen:\n${errorMessage}`;
  try {
    const verse = await sendToGPT({ role: GPTRole.POET, input: prompt });
    return verse.trim();
  } catch {
    return `Verse konnte nicht erzeugt werden: ${errorMessage}`;
  }
}
