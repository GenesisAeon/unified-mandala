import { GPTRole } from './gptRoles';

export interface GPTRequest {
  role: GPTRole;
  input: string;
  context?: any;
}

import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';
import { loadSymbolphasen } from '../shared-utils/loadSymbolphasen';
import { isValidRole } from './gptRoles';

// Mapping of GPT roles to supported models in priority order.
// AEON tries gpt-4.1 first and falls back to gpt-5 when needed.
const MODEL_MATRIX: Record<GPTRole, string[]> = {
  [GPTRole.AEON]: ['gpt-4.1', 'gpt-5'],
  [GPTRole.CREP]: ['gpt-4.1'],
  [GPTRole.POET]: ['gpt-4.1']
};

export async function sendToGPT(
  request: GPTRequest,
  retries = 2
): Promise<string> {
  if (!isValidRole(request.role)) {
    throw new Error(`Unbekannte GPT-Rolle: ${request.role}`);
  }
  const phaseId = getSymbolzeitPhase();
  const phases = loadSymbolphasen();
  const prefix = phases[phaseId]?.phase ? `[${phases[phaseId].phase}] ` : '';

  const endpoint = process.env.GPT_ENDPOINT || 'http://localhost:3000/gpt';
  const models = MODEL_MATRIX[request.role] || ['gpt-4.1'];

  for (const model of models) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...request, phase: phaseId, model })
        });
        if (!response.ok) {
          throw new Error(`GPT request failed: ${response.status}`);
        }
        const data = await response.json();
        const answer = data.response ?? '';
        return `${prefix}${answer}`;
      } catch (err) {
        if (attempt === retries) {
          if (model === models[models.length - 1]) {
            throw new Error(
              `Network request failed after ${retries + 1} attempts: ${(err as Error).message}`
            );
          }
          // try next model
          break;
        }
      }
    }
  }
  throw new Error('Unreachable');
}
