#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export interface MiniSigillinValidatorResult {
  hasCrepReference: boolean;
  hasTrikayaMapping: boolean;
  hasNextAction: boolean;
  isSafe: boolean;
  passes: boolean;
  score: number;
  missing: string[];
  matches: {
    crep: string[];
    trikaya: string[];
    nextAction: string[];
    unsafe: string[];
  };
}

const CREP_REGEX = buildWordRegex([
  'coherence',
  'kohärenz',
  'koharenz',
  'resonance',
  'resonanz',
  'emergence',
  'emergenz',
  'poetics',
  'poetik',
]);

const TRIKAYA_REGEX = buildWordRegex([
  'dharmakāya',
  'dharmakaya',
  'sambhogakāya',
  'sambhogakaya',
  'nirmāṇakāya',
  'nirmanakaya',
]);

const NEXT_ACTION_REGEX = buildWordRegex([
  'mini-sigillin',
  'minisigillin',
  'sigillin',
  'hypothese',
  'hypothesis',
  'messpunkt',
  'messpunkte',
  'measurement point',
  'nächste schritt',
  'nächsten schritt',
  'nächste schritte',
  'next step',
  'next steps',
  'aktion',
  'action',
  'experiment',
  'dispatch',
  'fraktal',
]);

const UNSAFE_REGEX = new RegExp(
  '(falsche daten|unklare fakten|ethische konflikte|sensitive daten)',
  'gi',
);

export function validateMandalaExplanation(text: string): MiniSigillinValidatorResult {
  const normalised = text ?? '';
  const crepMatches = collectMatches(normalised, CREP_REGEX);
  const trikayaMatches = collectMatches(normalised, TRIKAYA_REGEX);
  const nextActionMatches = collectMatches(normalised, NEXT_ACTION_REGEX);
  const unsafeMatches = collectMatches(normalised, UNSAFE_REGEX);

  const hasCrepReference = crepMatches.length > 0;
  const hasTrikayaMapping = trikayaMatches.length > 0;
  const hasNextAction = nextActionMatches.length > 0;
  const isSafe = unsafeMatches.length === 0;

  const passes = hasCrepReference && hasTrikayaMapping && hasNextAction && isSafe;
  const satisfied = [hasCrepReference, hasTrikayaMapping, hasNextAction, isSafe].filter(
    Boolean,
  ).length;
  const score = satisfied / 4;

  const missing: string[] = [];
  if (!hasCrepReference) missing.push('crep-reference');
  if (!hasTrikayaMapping) missing.push('trikaya-mapping');
  if (!hasNextAction) missing.push('next-action');
  if (!isSafe) missing.push('safety');

  return {
    hasCrepReference,
    hasTrikayaMapping,
    hasNextAction,
    isSafe,
    passes,
    score,
    missing,
    matches: {
      crep: crepMatches,
      trikaya: trikayaMatches,
      nextAction: nextActionMatches,
      unsafe: unsafeMatches,
    },
  };
}

function collectMatches(text: string, regex: RegExp): string[] {
  const results = new Set<string>();
  if (!text) return [];
  const globalRegex = new RegExp(
    regex.source,
    regex.flags.includes('g') ? regex.flags : `${regex.flags}g`,
  );
  let match: RegExpExecArray | null;
  while ((match = globalRegex.exec(text)) !== null) {
    if (match[0]) {
      results.add(match[0]);
    }
  }
  return Array.from(results);
}

function buildWordRegex(words: string[]): RegExp {
  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(?<![\\p{L}\\p{N}_-])(?:${escaped.join('|')})(?![\\p{L}\\p{N}_-])`, 'giu');
}

interface CliOptions {
  inputPath?: string;
  textParts: string[];
  json: boolean;
  quiet: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { textParts: [], json: false, quiet: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input' || arg === '-i') {
      const next = argv[i + 1];
      if (!next) {
        throw new Error('Expected a file path after --input');
      }
      options.inputPath = next;
      i += 1;
    } else if (arg === '--text' || arg === '-t') {
      const next = argv[i + 1];
      if (!next) {
        throw new Error('Expected text after --text');
      }
      options.textParts.push(next);
      i += 1;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--quiet') {
      options.quiet = true;
    } else if (arg === '--help' || arg === '-h') {
      printCliHelp();
      process.exit(0);
    } else if (arg === '--') {
      const rest = argv.slice(i + 1);
      if (rest.length > 0) {
        options.textParts.push(rest.join(' '));
      }
      break;
    } else {
      options.textParts.push(arg);
    }
  }

  return options;
}

function readFromFile(filePath: string): string {
  const absolute = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolute, 'utf8');
}

function readFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('error', reject);
    process.stdin.on('end', () => resolve(data));
  });
}

function printCliHelp() {
  console.log(
    `Usage: pnpm sigils:validate:mini [--input file]|[--text "..."] [--json]\n\n` +
      `Checks whether a Mandala explanation references CREP, Trikāya and a next action while avoiding unsafe phrases.`,
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let source = '';

  if (options.textParts.length > 0) {
    source = options.textParts.join(' ');
  } else if (options.inputPath) {
    source = readFromFile(options.inputPath);
  } else if (!process.stdin.isTTY) {
    source = await readFromStdin();
  } else {
    printCliHelp();
    process.exit(1);
  }

  const result = validateMandalaExplanation(source);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (!options.quiet) {
    printHumanReadable(result);
  }

  if (!result.passes) {
    process.exitCode = 1;
  }
}

function printHumanReadable(result: MiniSigillinValidatorResult) {
  const lines = [
    `CREP reference: ${result.hasCrepReference ? '✅' : '❌'} ${formatMatches(result.matches.crep)}`,
    `Trikāya mapping: ${result.hasTrikayaMapping ? '✅' : '❌'} ${formatMatches(result.matches.trikaya)}`,
    `Next action: ${result.hasNextAction ? '✅' : '❌'} ${formatMatches(result.matches.nextAction)}`,
    `Safety: ${result.isSafe ? '✅' : '❌'} ${formatUnsafe(result.matches.unsafe)}`,
    `Score: ${(result.score * 100).toFixed(0)}%`,
  ];

  if (result.missing.length > 0) {
    lines.push(`Missing: ${result.missing.join(', ')}`);
  }

  console.log(lines.join('\n'));
}

function formatMatches(matches: string[]): string {
  if (matches.length === 0) {
    return '(keine Treffer)';
  }
  return `(${matches.join(', ')})`;
}

function formatUnsafe(matches: string[]): string {
  if (matches.length === 0) {
    return '(keine riskanten Formulierungen gefunden)';
  }
  return `Warnung → ${matches.join(', ')}`;
}

const currentFile = fileURLToPath(import.meta.url);
const invokedAsCli = !!process.argv[1] && path.resolve(process.argv[1]) === currentFile;

if (invokedAsCli) {
  main().catch((error) => {
    console.error(
      '[mini-sigillin-validator] Unexpected error:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  });
}
