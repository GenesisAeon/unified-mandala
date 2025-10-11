import fs from 'fs';
import path from 'path';
import { Task } from '../core/interfaces';

export interface PoeticResult {
  timestamp: string;
  taskId: string;
  phase: string;
  crepScore: number;
  vers: string;
}

export class ResonanzPoetik {
  static generateHaiku(task: Task, phase: string, score: number): string {
    const base = task.description || 'Ein leerer Pfad';
    return [
      base.split(' ').slice(0, 5).join(' '),
      `Im Raum von ${phase} bewegt`,
      `CREP: ${score.toFixed(2)} Klang`,
    ].join('\n');
  }

  static compileYAML(results: PoeticResult[], filename = 'mandala-chronik.yaml'): void {
    const yamlBlocks = results.map((r) => {
      return [
        '---',
        `timestamp: ${r.timestamp}`,
        `taskId: ${r.taskId}`,
        `phase: ${r.phase}`,
        `crepScore: ${r.crepScore.toFixed(2)}`,
        'vers: |',
        `  ${r.vers.replace(/\n/g, '\n  ')}`,
      ].join('\n');
    });

    fs.writeFileSync(path.join(process.cwd(), filename), yamlBlocks.join('\n\n'));
  }
}
