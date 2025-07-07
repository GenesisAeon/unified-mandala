import axios from 'axios';
import { fractalDecompose, computeFractalMetric } from '../analysis/FractalAnalyzer';
import { symbolicRegression } from '../analysis/SymbolicRegression';

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

