import axios from 'axios';
import { fractalDecompose, computeFractalMetric } from '../analysis/FractalAnalyzer';
import { symbolicRegression } from '../analysis/SymbolicRegression';

export interface AgentWeights {
  coherence: number;
  resonance: number;
  emergence: number;
}

export function adjustWeights(
  weights: AgentWeights,
  metrics: AgentWeights,
  reward: number,
  lr = 0.1
): AgentWeights {
  const updated: AgentWeights = {
    coherence: clamp(weights.coherence + lr * reward * metrics.coherence, 0, 1),
    resonance: clamp(weights.resonance + lr * reward * metrics.resonance, 0, 1),
    emergence: clamp(weights.emergence + lr * reward * metrics.emergence, 0, 1)
  };
  return updated;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function fetchCosmicData(url: string): Promise<any> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch cosmic data', err);
    throw err;
  }
}

export function analyzeCosmicData(values: number[]): string {
  const fragments = values.flatMap(v => fractalDecompose(v));
  const metric = computeFractalMetric(fragments);
  return symbolicRegression([metric]);
}

