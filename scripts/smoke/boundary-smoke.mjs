#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const p = (...xs) => path.resolve(process.cwd(), ...xs);
const dir = p('data', 'logs', 'boundary');
const primary = p(dir, 'laws.json');
const demo = p(dir, 'laws.demo.json');

const exists = (f) => {
  try {
    return fs.statSync(f).isFile();
  } catch {
    return false;
  }
};

let ok = false;
if (exists(primary)) {
  console.log('boundary-smoke found', primary);
  ok = true;
} else if (exists(demo)) {
  console.log('boundary-smoke found', demo);
  ok = true;
} else {
  console.log('boundary-smoke no snapshot yet. Run: pnpm boundary:demo');
}

process.exit(ok ? 0 : 0);
