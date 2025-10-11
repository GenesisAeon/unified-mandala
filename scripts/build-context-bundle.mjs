import fs from 'node:fs';
import { execSync } from 'node:child_process';

const files = ['README.md', 'SOURCES.md', 'package.json', 'AGENTS.md'];

fs.mkdirSync('out', { recursive: true });
execSync(`zip -q out/context-bundle.zip ${files.join(' ')}`);
console.log('✅ created out/context-bundle.zip');
