import fs from 'fs';
import path from 'path';

export interface Prediction {
  year: number;
  summary: string;
}

export class FutureKIAgent {
  private predictions: Prediction[] = [];

  constructor(dataPath = path.resolve(__dirname, '../../data/agents/future-ki-predictions.json')) {
    try {
      const raw = fs.readFileSync(dataPath, 'utf8');
      this.predictions = JSON.parse(raw);
    } catch {
      this.predictions = [];
    }
  }

  list(): Prediction[] {
    return this.predictions;
  }

  predict(year: number): string | undefined {
    return this.predictions.find((p) => p.year === year)?.summary;
  }
}

export default FutureKIAgent;
