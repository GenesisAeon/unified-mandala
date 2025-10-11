import fs from 'fs';
import path from 'path';
import { PoeticState } from './AeonSigillinVault';

const DREAM_PATH = path.resolve('vault/dreams.json');

export interface DreamEntry {
  id: string;
  timestamp: string;
  vision: string;
}

export class DreamMemory {
  private static dreams: DreamEntry[] = [];

  static load(): void {
    if (fs.existsSync(DREAM_PATH)) {
      this.dreams = JSON.parse(fs.readFileSync(DREAM_PATH, 'utf-8'));
    }
  }

  static recordVision(state: PoeticState): void {
    const entry: DreamEntry = {
      id: state.id,
      timestamp: state.timestamp,
      vision: `🛌 Vision: ${state.content}`,
    };
    this.dreams.push(entry);
    fs.writeFileSync(DREAM_PATH, JSON.stringify(this.dreams, null, 2), 'utf-8');
  }

  static latest(n = 5): DreamEntry[] {
    return [...this.dreams].slice(-n).reverse();
  }
}
