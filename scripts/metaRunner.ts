#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

export interface FractalTask {
  command: string;
}
export interface MetaRunnerConfig {
  tasks: FractalTask[];
}

export function runMetaTasks(configPath: string): number {
  const abs = path.resolve(configPath);
  const data = yaml.load(fs.readFileSync(abs, 'utf8')) as MetaRunnerConfig;
  if (!data || !Array.isArray(data.tasks)) {
    throw new Error('Invalid MetaRunner config');
  }
  data.tasks.forEach((t) => {
    console.log(`MetaRunner executing: ${t.command}`);
    execSync(t.command, { stdio: 'inherit' });
  });
  return data.tasks.length;
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: metaRunner.ts <config.yaml>');
    process.exit(1);
  }
  runMetaTasks(file);
}
