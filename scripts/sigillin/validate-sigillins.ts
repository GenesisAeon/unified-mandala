// run with: pnpm validate:sigillins
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import fg from 'fast-glob';

type Result = { file: string; valid: boolean; errors: string[] };

const ROOT = process.cwd();
const SCHEMA_PATH = path.resolve(ROOT, 'scripts/sigillin/mandala-sigillin.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const validateSchema = ajv.compile(schema);

const CREP = ['Coherence', 'Resonance', 'Emergence', 'Poetics', 'CREP'];
const TRIKAYA = ['Dharmakāya', 'Sambhogakāya', 'Nirmāṇakāya', 'Trikāya'];
const NEXT = [
  'nächste Handlung',
  'nächste Schritte',
  'nächster Schritt',
  'next action',
  'next steps',
];

function readStructured(file: string): any {
  const ext = path.extname(file).toLowerCase();
  const raw = fs.readFileSync(file, 'utf8');
  if (ext === '.json') return JSON.parse(raw);
  if (ext === '.yaml' || ext === '.yml') return yaml.load(raw);
  // markdown wird separat geprüft und nicht strukturell validiert
  return raw;
}

function contentString(data: any): string {
  if (!data || !data.sigillin) return '';
  const s = data.sigillin;
  if (s.content && typeof s.content === 'object') {
    if (typeof (s.content as any).text === 'string') return (s.content as any).text;
    return JSON.stringify(s.content);
  }
  return JSON.stringify(s);
}

function hasAny(hay: string, needles: string[]) {
  return needles.some((k) => hay.includes(k));
}

function checkLinks(baseFile: string, data: any): string[] {
  const errs: string[] = [];
  const links: string[] = data?.sigillin?.links ?? [];
  for (const link of links) {
    // nur relative Files prüfen; custom schemes (aeon://…) überspringen wir
    if (/^[a-z]+:\/\//i.test(link)) continue;
    const p = path.resolve(path.dirname(baseFile), link);
    if (!fs.existsSync(p)) errs.push(`Link fehlt: ${link}`);
  }
  return errs;
}

async function validateOne(file: string): Promise<Result> {
  const ext = path.extname(file).toLowerCase();
  const errors: string[] = [];
  try {
    if (ext === '.md') {
      const md = fs.readFileSync(file, 'utf8');
      if (!hasAny(md, CREP)) errors.push('MD: CREP-Bezug fehlt.');
      if (!hasAny(md, TRIKAYA)) errors.push('MD: Trikāya-Bezug fehlt.');
      if (!hasAny(md, NEXT)) errors.push('MD: Nächste Handlung fehlt.');
      return { file, valid: errors.length === 0, errors };
    }

    const data = readStructured(file);
    const ok = validateSchema(data);
    if (!ok) {
      for (const err of validateSchema.errors ?? []) {
        const where = (err.instancePath || err.schemaPath || '').toString();
        errors.push(`Schema: ${where} ${err.message}`);
      }
    }

    const body = contentString(data);
    if (!hasAny(body, CREP)) errors.push('Content: CREP-Bezug fehlt.');
    if (!hasAny(body, TRIKAYA)) errors.push('Content: Trikāya-Bezug fehlt.');
    if (!hasAny(body, NEXT)) errors.push('Content: Nächste Handlung fehlt.');

    errors.push(...checkLinks(file, data));

    return { file, valid: errors.length === 0, errors };
  } catch (e: any) {
    return { file, valid: false, errors: [`Parsefehler: ${e.message}`] };
  }
}

async function main() {
  const patterns = process.argv.slice(2);
  const globs = patterns.length
    ? patterns
    : [
        'sigils/**/*.{json,yaml,yml,md}',
        'docs/sigillin/**/*.{json,yaml,yml,md}',
        'docs/**/*.sigil.{json,yaml,yml}',
      ];

  const files = await fg(globs, { cwd: ROOT, dot: false, absolute: true });
  if (!files.length) {
    console.log('ℹ️  Keine Sigillin-Dateien gefunden.');
    process.exit(0);
  }

  const results = await Promise.all(files.map(validateOne));
  for (const r of results) {
    if (r.valid) {
      console.log(`✅ ${path.relative(ROOT, r.file)}`);
    } else {
      console.log(`❌ ${path.relative(ROOT, r.file)}`);
      for (const e of r.errors) console.log(`   - ${e}`);
    }
  }
  const bad = results.filter((r) => !r.valid);
  if (bad.length) {
    console.error(`\n🚨 Sigillin-Validierung fehlgeschlagen (${bad.length}/${results.length}).`);
    process.exit(1);
  } else {
    console.log(`\n🌱 Sigillin-Validierung grün (${results.length}/${results.length}).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
