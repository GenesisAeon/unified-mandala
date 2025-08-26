import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';

interface PatternMap {
  [pattern: string]: string[];
}

/**
 * PatternMapperGPT analyzes task descriptions and builds a simple
 * occurrence map for quick prompt suggestions.
 */
export class PatternMapperGPT implements Agent {
  id = 'PatternMapperGPT';
  layer: 'Pattern' = 'Pattern';
  private map: PatternMap = {};

  constructor(private output = 'pattern-map.json') {}

  async handle(task: Task): Promise<void> {
    const tokens = task.description.toLowerCase().split(/\W+/).filter(Boolean);
    for (const tok of tokens) {
      if (!this.map[tok]) this.map[tok] = [];
      if (!this.map[tok].includes(task.id)) this.map[tok].push(task.id);
    }
    fs.writeFileSync(path.resolve(this.output), JSON.stringify(this.map, null, 2));
    console.log(`\uD83E\uDDE9 PatternMapperGPT \u2192 mapped ${task.id}`);
  }
}

export default PatternMapperGPT;
