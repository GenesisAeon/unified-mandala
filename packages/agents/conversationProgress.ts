import fs from 'fs';
import path from 'path';

const STORE_PATH = path.resolve('GenesisAeonZIPMEM/conversation_progress.json');

export interface ProgressState {
  processed: string[];
}

export function loadProgress(): ProgressState {
  if (fs.existsSync(STORE_PATH)) {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as ProgressState;
  }
  return { processed: [] };
}

export function markProcessed(id: string): void {
  const state = loadProgress();
  if (!state.processed.includes(id)) {
    state.processed.push(id);
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), 'utf8');
  }
}

export function isProcessed(id: string): boolean {
  const state = loadProgress();
  return state.processed.includes(id);
}
