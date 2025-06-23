import { sendToGPT } from './aeon-gpt-synapse';
import { GPTRole } from './gptRoles';

export async function chatWithContext(prompt: string, context = 'C-Tutor'): Promise<string> {
  return sendToGPT({ role: GPTRole.AEON, input: prompt, context });
}
