import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { globSync } from 'glob';

type RuleEntry = string | { text?: string; trikaya_ebene?: unknown } | Record<string, unknown>;

type TableEntry = string[] | { metric?: string; name?: string; label?: string } | unknown;

interface SigillinDocument {
  sigillin?: {
    essenz?: string;
    content?: {
      sections?: Section[];
    };
  };
  [key: string]: unknown;
}

interface Section extends Record<string, unknown> {
  id?: string;
  title?: string;
  rules?: RuleEntry[] | unknown;
  table?: TableEntry[] | unknown;
  examples?: unknown;
}

interface Suggestion {
  issue: string;
  fix: string;
  line?: number;
  apply?: (doc: SigillinDocument) => void;
}

interface FileResult {
  path: string;
  raw: string;
  document: SigillinDocument;
  suggestions: Suggestion[];
  crepScore: ScoreResult;
  lexicalDensity?: number;
}

interface ScoreResult {
  score: number;
  issues: string[];
}

const DEFAULT_PATTERN = 'sigils/bridges/*/*-bridge.sigil.json';
const REQUIRED_CREPS = ['coherence', 'resonance', 'emergence', 'poetics'];

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const argSet = new Set(args);
  const dryRun = argSet.has('--dry-run');
  const autoApply = argSet.has('--auto');
  const interactive = argSet.has('--interactive') || (!dryRun && !autoApply);
  const pattern = resolvePattern(args);

  const files = globSync(pattern, { windowsPathsNoEscape: true });

  if (files.length === 0) {
    console.warn(`⚠️ Keine Sigillin-Dateien gefunden für Pattern: ${pattern}`);
    return;
  }

  const results = files.map((file) => analyseFile(file));
  const totalSuggestions = results.reduce((total, result) => total + result.suggestions.length, 0);

  if (totalSuggestions === 0) {
    console.log('✅ Alle Sigillins sind korrekt!');
    printScoreboard(results);
    return;
  }

  console.log(`🔧 ${totalSuggestions} Korrekturvorschläge gefunden:`);
  for (const result of results) {
    if (result.suggestions.length === 0) continue;

    console.log(`\n📄 ${result.path}`);
    for (const suggestion of result.suggestions) {
      console.log(`🚨 ${suggestion.issue}`);
      console.log(`🔧 Vorschlag: ${suggestion.fix}`);
      if (typeof suggestion.line === 'number') {
        console.log(`   ↳ ca. Zeile ${suggestion.line}`);
      }
    }
    printScore(result);
  }

  const hasApplicable = results.some((result) =>
    result.suggestions.some((suggestion) => typeof suggestion.apply === 'function'),
  );

  if (dryRun || !hasApplicable) {
    printScoreboard(results);
    return;
  }

  const suggestionsToApply = results.reduce(
    (count, result) =>
      count +
      result.suggestions.filter((suggestion) => typeof suggestion.apply === 'function').length,
    0,
  );

  let confirmed = autoApply;
  if (!autoApply && interactive) {
    confirmed = await askForConfirmation(
      `Sollen ${suggestionsToApply} Vorschläge automatisch angewendet werden?`,
    );
  }

  if (!confirmed) {
    console.log('ℹ️ Änderungen wurden nicht angewendet.');
    printScoreboard(results);
    return;
  }

  applySuggestions(results);
  printScoreboard(results);
}

function resolvePattern(args: string[]): string {
  const patternIndex = args.findIndex((value) => value === '--pattern');
  if (patternIndex >= 0 && args[patternIndex + 1]) {
    return args[patternIndex + 1];
  }
  return DEFAULT_PATTERN;
}

function analyseFile(filePath: string): FileResult {
  const raw = readFileSync(filePath, 'utf8');
  const document = JSON.parse(raw) as SigillinDocument;
  const suggestions: Suggestion[] = [];
  const sections = extractSections(document);

  const guidelineSuggestion = analyseGuidelines(document, sections, raw);
  if (guidelineSuggestion) suggestions.push(guidelineSuggestion);

  const crepSuggestion = analyseCrepTable(document, sections, raw);
  if (crepSuggestion) suggestions.push(crepSuggestion);

  const nextStepsSuggestion = analyseNextSteps(document, sections, raw);
  if (nextStepsSuggestion) suggestions.push(nextStepsSuggestion);

  const lexicalDensity = calculateLexicalDensity(document.sigillin?.essenz ?? '');
  if (lexicalDensity > 0 && lexicalDensity < 0.3) {
    suggestions.push({
      issue: `Niedrige poetische Qualität (Score: ${lexicalDensity.toFixed(2)})`,
      fix: 'Formuliere "essenz" bildhafter und reduziere Wiederholungen. Beispiel: "Unified Mandala webt Bedeutung zu einem atmenden System – CREP als Kompass, Trikāya als Raum."',
      line: approximateLine(raw, '"essenz"'),
    });
  }

  const crepScore = calculateDynamicCrepScore(document);

  return {
    path: path.normalize(filePath),
    raw,
    document,
    suggestions,
    crepScore,
    lexicalDensity,
  };
}

function analyseGuidelines(
  document: SigillinDocument,
  sections: Section[],
  raw: string,
): Suggestion | undefined {
  const guidelines = sections.find((section) => normaliseId(section.id) === 'guidelines');
  const rules = Array.isArray(guidelines?.rules) ? (guidelines?.rules as RuleEntry[]) : [];
  const hasTrikayaReference = rules.some((rule) => ruleIncludesTrikaya(rule));

  if (hasTrikayaReference) return undefined;

  return {
    issue: 'Fehlende Trikāya-Referenz in den Guidelines',
    fix: 'Füge eine Regel hinzu wie: "Jeder Kernpunkt MUSS einer Trikāya-Ebene (Dharmakāya/Sambhogakāya/Nirmāṇakāya) zugeordnet sein."',
    line: approximateLine(raw, '"guidelines"'),
    apply: (doc) => {
      const docSections = ensureSections(doc);
      let target = docSections.find((section) => normaliseId(section.id) === 'guidelines');

      if (!target) {
        target = { id: 'guidelines', title: 'Leitlinien', rules: [] };
        docSections.push(target);
      }

      if (!Array.isArray(target.rules)) {
        target.rules = [];
      }

      const rulesArray = target.rules as RuleEntry[];
      rulesArray.push(
        'Jeder Kernpunkt MUSS einer Trikāya-Ebene (Dharmakāya/Sambhogakāya/Nirmāṇakāya) zugeordnet sein.',
      );
    },
  };
}

function analyseCrepTable(
  document: SigillinDocument,
  sections: Section[],
  raw: string,
): Suggestion | undefined {
  const crepSection = sections.find((section) => normaliseId(section.id) === 'crep_explained');
  const table = Array.isArray(crepSection?.table) ? (crepSection?.table as TableEntry[]) : [];
  const presentMetrics = new Set(
    table
      .map((entry) => extractMetric(entry))
      .filter((metric): metric is string => typeof metric === 'string')
      .map((metric) => metric.toLowerCase()),
  );

  const missingMetrics = REQUIRED_CREPS.filter((metric) => !presentMetrics.has(metric));

  if (missingMetrics.length === 0) return undefined;

  return {
    issue: `Fehlende CREP-Metriken: ${missingMetrics.map(capitalise).join(', ')}`,
    fix: `Ergänze Zeilen für ${missingMetrics.map(capitalise).join(' und ')} in der CREP-Tabelle. Beispiel: ["${missingMetrics[0].toUpperCase()}", "Kurzbeschreibung", "Beispiel"]`,
    line: approximateLine(raw, '"crep_explained"'),
    apply: (doc) => {
      const docSections = ensureSections(doc);
      let target = docSections.find((section) => normaliseId(section.id) === 'crep_explained');
      if (!target) {
        target = { id: 'crep_explained', title: 'CREP erklärt', table: [] };
        docSections.push(target);
      }

      if (!Array.isArray(target.table)) {
        target.table = [];
      }

      const tableArray = target.table as unknown[];
      for (const metric of missingMetrics) {
        tableArray.push([capitalise(metric), 'Kurzbeschreibung', 'Beispiel']);
      }
    },
  };
}

function analyseNextSteps(
  document: SigillinDocument,
  sections: Section[],
  raw: string,
): Suggestion | undefined {
  const nextSection = findNextStepsSection(sections);
  if (!nextSection) {
    return {
      issue: "Fehlender Abschnitt 'Nächste Schritte'",
      fix: 'Füge einen Abschnitt hinzu: { id: "naechste_schritte", title: "Nächste Schritte", examples: [{ handlung: "Mini-Sigillin für [Ziel] anlegen", messpunkt: "CREP-Score nach 1 Woche (Ziel: C > 0.85)" }] }',
      line: approximateLine(raw, '"sections"'),
      apply: (doc) => {
        const docSections = ensureSections(doc);
        docSections.push({
          id: 'naechste_schritte',
          title: 'Nächste Schritte',
          examples: [
            {
              handlung: 'Mini-Sigillin für [Ziel] anlegen',
              messpunkt: 'CREP-Score nach 1 Woche (Ziel: C > 0.85)',
            },
          ],
        });
      },
    };
  }

  const examples = Array.isArray(nextSection.examples) ? (nextSection.examples as unknown[]) : [];

  if (examples.length > 0) return undefined;

  return {
    issue: "Leere 'Nächste Schritte'-Beispiele",
    fix: 'Füge mindestens ein Beispiel hinzu: { handlung: "Mini-Sigillin für [konkretes Ziel] anlegen", messpunkt: "CREP-Score nach [Zeitraum] (Ziel: [Wert])" }',
    line: approximateLine(raw, '"naechste_schritte"'),
    apply: (doc) => {
      const docSections = ensureSections(doc);
      const target = findNextStepsSection(docSections);
      if (!target) return;

      if (!Array.isArray(target.examples)) {
        target.examples = [];
      }

      const exampleArray = target.examples as unknown[];
      exampleArray.push({
        handlung: 'Mini-Sigillin für [konkretes Ziel] anlegen',
        messpunkt: 'CREP-Score nach [Zeitraum] (Ziel: [Wert])',
      });
    },
  };
}

function findNextStepsSection(sections: Section[]): Section | undefined {
  return sections.find((section) => {
    const id = normaliseId(section.id);
    return id === 'naechste_schritte' || id === 'next_steps' || id === 'nextsteps';
  });
}

function ruleIncludesTrikaya(rule: RuleEntry): boolean {
  if (typeof rule === 'string') {
    return rule.toLowerCase().includes('trik') || rule.toLowerCase().includes('trika');
  }

  if (rule && typeof rule === 'object') {
    if ('trikaya_ebene' in rule) return true;
    const text = (rule as { text?: string }).text;
    if (typeof text === 'string') {
      return text.toLowerCase().includes('trik');
    }
  }

  return false;
}

function extractMetric(entry: TableEntry): string | undefined {
  if (Array.isArray(entry) && entry.length > 0) {
    return typeof entry[0] === 'string' ? entry[0] : undefined;
  }

  if (entry && typeof entry === 'object') {
    const candidate =
      (entry as { metric?: string }).metric ??
      (entry as { name?: string }).name ??
      (entry as { label?: string }).label;
    return typeof candidate === 'string' ? candidate : undefined;
  }

  return undefined;
}

function calculateDynamicCrepScore(document: SigillinDocument): ScoreResult {
  let score = 1;
  const issues: string[] = [];
  const sections = extractSections(document);

  const guidelines = sections.find((section) => normaliseId(section.id) === 'guidelines');
  const rules = Array.isArray(guidelines?.rules) ? (guidelines?.rules as RuleEntry[]) : [];
  const hasTrikaya = rules.some((rule) => ruleIncludesTrikaya(rule));
  if (!hasTrikaya) {
    score -= 0.1;
    issues.push('Fehlende Trikāya-Referenz');
  }

  const crepSection = sections.find((section) => normaliseId(section.id) === 'crep_explained');
  const table = Array.isArray(crepSection?.table) ? (crepSection?.table as TableEntry[]) : [];
  const presentMetrics = new Set(
    table
      .map((entry) => extractMetric(entry))
      .filter((metric): metric is string => typeof metric === 'string')
      .map((metric) => metric.toLowerCase()),
  );

  if (REQUIRED_CREPS.some((metric) => !presentMetrics.has(metric))) {
    score -= 0.2;
    issues.push('Unvollständige CREP-Tabelle');
  }

  const nextSteps = findNextStepsSection(sections);
  const examples = Array.isArray(nextSteps?.examples) ? (nextSteps?.examples as unknown[]) : [];

  if (!nextSteps || examples.length === 0) {
    score -= 0.2;
    issues.push("Fehlende 'Nächste Schritte'");
  }

  const boundedScore = Math.max(0, Math.min(1, score));

  return {
    score: parseFloat(boundedScore.toFixed(2)),
    issues,
  };
}

function calculateLexicalDensity(text: string): number {
  const tokens = text.match(/\p{L}+/gu) ?? [];
  if (tokens.length === 0) return 0;
  const unique = new Set(tokens.map((token) => token.toLowerCase()));
  return unique.size / tokens.length;
}

function extractSections(document: SigillinDocument): Section[] {
  const sections = document.sigillin?.content?.sections;
  if (!sections || !Array.isArray(sections)) return [];
  return sections as Section[];
}

function ensureSections(document: SigillinDocument): Section[] {
  if (!document.sigillin) {
    document.sigillin = {};
  }
  if (!document.sigillin.content) {
    document.sigillin.content = { sections: [] };
  }
  if (!Array.isArray(document.sigillin.content.sections)) {
    document.sigillin.content.sections = [];
  }
  return document.sigillin.content.sections as Section[];
}

function approximateLine(raw: string, search: string): number | undefined {
  const lines = raw.split(/\r?\n/);
  const index = lines.findIndex((line) => line.includes(search));
  return index >= 0 ? index + 1 : undefined;
}

function normaliseId(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function capitalise(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function askForConfirmation(message: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${message} (y/N) `);
    const normalised = answer.trim().toLowerCase();
    return normalised === 'y' || normalised === 'yes' || normalised === 'j' || normalised === 'ja';
  } finally {
    rl.close();
  }
}

function applySuggestions(results: FileResult[]): void {
  for (const result of results) {
    let applied = false;
    for (const suggestion of result.suggestions) {
      if (typeof suggestion.apply === 'function') {
        suggestion.apply(result.document);
        applied = true;
      }
    }

    if (applied) {
      writeFileSync(result.path, `${JSON.stringify(result.document, null, 2)}\n`, 'utf8');
      console.log(`✅ Korrigiert: ${result.path}`);
    }
  }
}

function printScore(result: FileResult): void {
  const issueSummary = result.crepScore.issues.length
    ? ` (Themen: ${result.crepScore.issues.join(', ')})`
    : '';
  console.log(`📊 CREP-Score: ${result.crepScore.score.toFixed(2)}${issueSummary}`);
  if (typeof result.lexicalDensity === 'number') {
    console.log(`🎭 Poetische Dichte: ${result.lexicalDensity.toFixed(2)}`);
  }
}

function printScoreboard(results: FileResult[]): void {
  console.log('\n📋 Zusammenfassung:');
  for (const result of results) {
    const issueSummary = result.crepScore.issues.length
      ? ` – Themen: ${result.crepScore.issues.join(', ')}`
      : '';
    const lexical =
      typeof result.lexicalDensity === 'number' && result.lexicalDensity > 0
        ? ` – Poetik: ${result.lexicalDensity.toFixed(2)}`
        : '';
    console.log(
      `• ${result.path}: CREP ${result.crepScore.score.toFixed(2)}${issueSummary}${lexical}`,
    );
  }
}

main().catch((error) => {
  console.error('❌ Sigillin-Korrekturlauf fehlgeschlagen:', error);
  process.exit(1);
});
