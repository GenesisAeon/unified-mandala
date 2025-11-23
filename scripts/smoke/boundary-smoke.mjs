#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

export function extractEventsFromSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return Array.isArray(snapshot) ? snapshot : [];
  }
  if (Array.isArray(snapshot)) {
    return snapshot;
  }
  if (Array.isArray(snapshot.laws)) {
    return snapshot.laws;
  }
  if (Array.isArray(snapshot.events)) {
    return snapshot.events;
  }
  return [];
}

export function readBoundarySnapshot(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(raw);
  return { json, events: extractEventsFromSnapshot(json) };
}

export function validateEventKeys(events) {
  const missing = [];
  const duplicates = [];
  const seen = new Map();
  events.forEach((event, index) => {
    const current = event ?? {};
    const explicitKey = typeof current.eventKey === 'string' ? current.eventKey.trim() : '';
    const fallback = [current.source, current.ruleId, current.verdict]
      .filter((part) => typeof part === 'string' && part.length > 0)
      .join('#');
    const dedupeKey = explicitKey || fallback;
    if (!explicitKey) {
      missing.push({
        index,
        fallback,
        source: current.source,
        ruleId: current.ruleId,
        verdict: current.verdict,
      });
    }
    if (dedupeKey) {
      if (seen.has(dedupeKey)) {
        duplicates.push({
          index,
          previousIndex: seen.get(dedupeKey),
          key: dedupeKey,
          source: current.source,
          ruleId: current.ruleId,
          verdict: current.verdict,
        });
      } else {
        seen.set(dedupeKey, index);
      }
    }
  });
  return { ok: missing.length === 0 && duplicates.length === 0, missing, duplicates };
}

export function findSnapshotFile() {
  if (exists(primary)) return primary;
  if (exists(demo)) return demo;
  return null;
}

export async function main() {
  const snapshotFile = findSnapshotFile();
  if (!snapshotFile) {
    console.log('boundary-smoke no snapshot yet. Run: pnpm boundary:demo');
    return 0;
  }
  console.log('boundary-smoke found', snapshotFile);
  const { events } = readBoundarySnapshot(snapshotFile);
  console.log(`boundary-smoke loaded ${events.length} event(s)`);
  const result = validateEventKeys(events);
  if (!result.ok) {
    if (result.missing.length > 0) {
      console.error('boundary-smoke missing eventKey for entries:', result.missing);
    }
    if (result.duplicates.length > 0) {
      console.error('boundary-smoke duplicate event keys detected:', result.duplicates);
    }
    return 1;
  }
  const unique = new Set(
    events.map(
      (evt) => evt.eventKey ?? [evt.source, evt.ruleId, evt.verdict].filter(Boolean).join('#'),
    ),
  );
  console.log(`boundary-smoke eventKey coverage ok (${unique.size} unique)`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const exitCode = await main();
  process.exit(exitCode);
}
