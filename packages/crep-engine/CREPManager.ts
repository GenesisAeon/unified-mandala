import { CREPEntry } from './types';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';
import fs from 'fs';
import path from 'path';

export class CREPManager {
  private crepHistory: CREPEntry[] = [];
  private useLocalStorage: boolean;
  private filePath: string;

  constructor() {
    this.useLocalStorage = typeof globalThis.localStorage !== 'undefined';
    this.filePath = path.resolve(process.cwd(), 'crepHistory.json');
    try {
      let savedHistory: string | null = null;
      if (this.useLocalStorage) {
        savedHistory = localStorage.getItem('crepHistory');
      } else if (fs.existsSync(this.filePath)) {
        savedHistory = fs.readFileSync(this.filePath, 'utf8');
      }
      if (savedHistory) {
        this.crepHistory = JSON.parse(savedHistory).map((entry: CREPEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      }
    } catch (error) {
      console.error('Fehler beim Parsen der CREP-History:', error);
      this.crepHistory = [];
    }
  }

  addCREPEntry(C: number, R: number, E: number, P: number) {
    const entry: CREPEntry = { timestamp: new Date(), C, R, E, P };
    this.crepHistory.push(entry);
    if (this.useLocalStorage) {
      localStorage.setItem('crepHistory', JSON.stringify(this.crepHistory));
    } else {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.crepHistory));
      } catch (err) {
        console.error('Fehler beim Schreiben der CREP-History:', err);
      }
    }
    GPTEventHub.emit('crep:updated', entry);
  }

  getCREPHistory() {
    return this.crepHistory;
  }

  getAverageCREP(lastN = this.crepHistory.length) {
    const slice = this.crepHistory.slice(-lastN);
    if (!slice.length) return { C: 0, R: 0, E: 0, P: 0 };
    const totals = slice.reduce(
      (acc, e) => {
        acc.C += e.C;
        acc.R += e.R;
        acc.E += e.E;
        acc.P += e.P;
        return acc;
      },
      { C: 0, R: 0, E: 0, P: 0 }
    );
    const count = slice.length;
    return {
      C: totals.C / count,
      R: totals.R / count,
      E: totals.E / count,
      P: totals.P / count,
    };
  }
}
