#!/usr/bin/env ts-node
import { readFileSync } from 'fs';

type Sigillin = {
  id: string;
  crep?: { score?: number };
  source?: string;
};

const data = JSON.parse(readFileSync('out/sigillin_index.json', 'utf8'));
const sigs: Sigillin[] = data.sigillins ?? data.sigillins ?? [];
function pairs<T>(xs: T[]) {
  const r: [T, T][] = [];
  for (let i = 0; i < xs.length; i++)
    for (let j = i + 1; j < xs.length; j++) r.push([xs[i], xs[j]]);
  return r;
}
function interAdapterResonance(a: number = 0, b: number = 0) {
  return 1 - Math.abs((a || 0) - (b || 0));
}

const rows = pairs(sigs)
  .filter(([a, b]) => a.source && b.source && a.source !== b.source)
  .map(([a, b]) => ({
    a: a.id,
    b: b.id,
    score: interAdapterResonance(a.crep?.score || 0, b.crep?.score || 0),
  }));

console.log(JSON.stringify({ pairs: rows.slice(0, 500) }, null, 2));
