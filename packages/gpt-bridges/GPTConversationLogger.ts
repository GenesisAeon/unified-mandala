import { GPTEventHub } from './GPTEventHub';
import { generateGespraechsfall, Gespraechsfall } from '../shared-utils/GespraechsfallGenerator';

export const gptConversations: Gespraechsfall[] = [];

export function initGPTConversationLogger() {
  GPTEventHub.on('response', (payload: { prompt: string; response: string }) => {
    gptConversations.push(generateGespraechsfall(payload.prompt, payload.response));
  });
}
