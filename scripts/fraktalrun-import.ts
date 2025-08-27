// scripts/fraktalrun-import.ts
// Fraktalrun Importer für advancedToDo.{yaml,json}
// Läuft mit:  npx tsx scripts/fraktalrun-import.ts  (oder via npm script)
// Flags: --dryRun --manifest=fraktalrun/manifest.yaml --verbose

import { readFile, writeFile, stat } from "fs/promises";
import * as path from "path";
import process from "process";

type AnyRec = Record<string, any>;

// Lazy deps (keine ESM/TS-Config-Qualen im Monorepo)
async function useYaml() {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import("yaml");
    return mod.default || mod;
  } catch {
    console.error("✖ Benötige das Paket 'yaml'. Bitte installieren:  npm i -D yaml");
    process.exit(1);
  }
}
async function useAjv() {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const Ajv = (await import("ajv")).default;
    const addFormats = (await import("ajv-formats")).default;
    const ajv = new Ajv({ strict: false, allErrors: true });
    addFormats(ajv);
    return ajv;
  } catch {
    console.error("✖ Benötige die Pakete 'ajv' und 'ajv-formats'. Bitte installieren:  npm i -D ajv ajv-formats");
    process.exit(1);
  }
}

/* --------------------------- CLI & Utilities --------------------------- */

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.includes("=") ? a.split("=") : [a, true];
    return [k.replace(/^--/, ""), v];
  })
);
const verbose = !!argv.verbose || !!argv.v;

function log(...args: any[]) {
  if (verbose) console.log(...args);
}

function exists(p: string) {
  return stat(p).then(
    () => true,
    () => false
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 72);
}
function toArray<T>(x: any): T[] {
  if (Array.isArray(x)) return x as T[];
  if (x == null) return [];
  return [x as T];
}
function pickFirst(obj: AnyRec, candidates: string[]) {
  for (const k of candidates) {
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") return obj[k];
  }
  return undefined;
}
function deepSet(obj: AnyRec, pathArr: string[], val: any) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    if (!(k in cur) || typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[pathArr[pathArr.length - 1]] = val;
}

/* ------------------------------ Types ---------------------------------- */

type Manifest = {
  kind: "FraktalRun";
  version: number;
  meta?: AnyRec;
  sources: ({ path: string; format: "yaml" | "json" } | { optional: { path: string; format: "yaml" | "json" }[] })[];
  schema: { task: string };
  mapping: string;
  output: { normalized_tasks: string; progress_journal?: string };
  policies?: {
    dedupe?: { keys: string[]; strategy?: "keep-highest-priority" | "keep-first" };
    priority?: { weights?: Record<string, number> };
  };
  runtime?: { dryRun?: boolean; commit?: { enabled?: boolean; message?: string } };
};

type Mapping = {
  defaults?: AnyRec;
  fields: AnyRec; // Zielfeld -> string[] | nested map
  transforms?: { name: string; when?: string; do?: string }[];
};

type FraktalTask = {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in-progress" | "blocked" | "done" | "queued" | "backlog" | "risk";
  priority: number;
  owner?: string;
  labels?: string[];
  due?: string;
  area?: string;
  component?: string;
  phase?: "PRÄSENZ" | "LEERE" | "AUFLÖSUNG";
  trikaya?: "Dharmakāya" | "Sambhogakāya" | "Nirmāṇakāya";
  crep?: { resonance?: number; coherence?: number; emergence?: number; poetics?: number };
  sigillin?: AnyRec;
  acceptance?: string[];
  score?: number;
};

/* --------------------------- Load & Parse ------------------------------- */

async function loadYamlOrJson(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = await readFile(filePath, "utf8");
  if (ext === ".json") return JSON.parse(raw);
  const YAML = await useYaml();
  return YAML.parse(raw);
}

async function writeYaml(filePath: string, data: any, headerComment?: string) {
  const YAML = await useYaml();
  const doc = new YAML.Document(data);
  if (headerComment) doc.commentBefore = headerComment;
  await writeFile(filePath, String(doc), "utf8");
}

function asTaskArray(input: any): AnyRec[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.tasks)) return input.tasks;
  // Map von key->task?
  const vals = Object.values(input);
  if (vals.every((v) => typeof v === "object")) return vals as AnyRec[];
  return [];
}

/* --------------------------- Mapping Engine ----------------------------- */

function applyMapping(raw: AnyRec, mapping: Mapping): AnyRec {
  const out: AnyRec = { ...(mapping.defaults || {}) };

  function mapFields(prefix: string[], spec: AnyRec, src: AnyRec) {
    for (const [target, sourceSpec] of Object.entries(spec)) {
      if (Array.isArray(sourceSpec)) {
        const val = pickFirst(src, sourceSpec as string[]);
        if (val !== undefined) deepSet(out, [...prefix, target], val);
      } else if (typeof sourceSpec === "object" && sourceSpec) {
        // nested
        mapFields([...prefix, target], sourceSpec as AnyRec, src);
      }
    }
  }
  mapFields([], mapping.fields, raw);

  // Named transforms aus unserem Vorschlag
  normalizeTransforms(out);
  return out;
}

function normalizeTransforms(task: AnyRec) {
  // normalize-title
  if (typeof task.title === "string") task.title = task.title.trim();

  // slug-if-missing
  if (!task.id && task.title) task.id = slugify(task.title);

  // priority-range
  if (task.priority != null) task.priority = clamp(Number(task.priority) || 1, 1, 5);

  // labels-lowercase
  if (Array.isArray(task.labels)) task.labels = task.labels.map((l: any) => String(l).toLowerCase());

  // derive-phase
  const st = String(task.status || "").toLowerCase();
  if (["blocked", "risk"].includes(st)) task.phase = "AUFLÖSUNG";
  else if (["queued", "backlog"].includes(st)) task.phase = "LEERE";
  else task.phase = task.phase || "PRÄSENZ";

  // trikaya-from-area
  const area = String(task.area || "").toLowerCase();
  if (["infra", "ops"].includes(area)) task.trikaya = "Nirmāṇakāya";
  else if (["ui", "xr", "symbol"].includes(area)) task.trikaya = "Sambhogakāya";
  else task.trikaya = task.trikaya || "Dharmakāya";
}

/* --------------------------- Dedupe & Score ----------------------------- */

function makeKey(t: FraktalTask, keys: string[]) {
  return keys.map((k) => String((t as AnyRec)[k] ?? "").toLowerCase()).join("|");
}

function dedupe(tasks: FraktalTask[], keys: string[], strategy: "keep-highest-priority" | "keep-first") {
  const out: FraktalTask[] = [];
  const seen = new Map<string, FraktalTask>();
  for (const t of tasks) {
    const k = makeKey(t, keys);
    if (!seen.has(k)) {
      seen.set(k, t);
      out.push(t);
    } else if (strategy === "keep-highest-priority") {
      const cur = seen.get(k)!;
      if ((t.priority ?? 1) > (cur.priority ?? 1)) {
        // replace in map & array
        seen.set(k, t);
        const idx = out.indexOf(cur);
        if (idx >= 0) out[idx] = t;
      }
    }
  }
  return out;
}

function urgencyFromDue(due?: string) {
  if (!due) return 0.3;
  const inMs = new Date(due).getTime() - Date.now();
  if (isNaN(inMs)) return 0.3;
  const days = inMs / (1000 * 60 * 60 * 24);
  if (days <= 0) return 1.0;
  if (days < 3) return 0.9;
  if (days < 7) return 0.7;
  if (days < 14) return 0.5;
  if (days < 30) return 0.4;
  return 0.2;
}

function scoreTasks(tasks: FraktalTask[], weights: Record<string, number>) {
  const w = { resonance: 0.35, coherence: 0.35, emergence: 0.2, urgency: 0.1, ...weights };
  for (const t of tasks) {
    const c = t.crep || {};
    const urgency = urgencyFromDue(t.due);
    const s =
      (Number(c.resonance ?? 0.5) || 0) * w.resonance +
      (Number(c.coherence ?? 0.5) || 0) * w.coherence +
      (Number(c.emergence ?? 0.5) || 0) * w.emergence +
      urgency * w.urgency;
    t.score = Math.round(s * 1000) / 1000;
  }
  tasks.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || (b.priority ?? 0) - (a.priority ?? 0));
  return tasks;
}

/* ------------------------------- Main ----------------------------------- */

async function main() {
  const manifestPath = String(argv.manifest || "fraktalrun/manifest.yaml");
  const dryRun = Boolean(argv.dryRun) || false;

  if (!(await exists(manifestPath))) {
    console.error(`✖ Manifest nicht gefunden: ${manifestPath}`);
    process.exit(1);
  }
  const manifest = (await loadYamlOrJson(manifestPath)) as Manifest;

  const baseDir = path.dirname(manifestPath);
  const mapping = (await loadYamlOrJson(path.resolve(baseDir, manifest.mapping))) as Mapping;
  const taskSchema = await loadYamlOrJson(path.resolve(baseDir, manifest.schema.task));

  // 1) Ingest
  const records: AnyRec[] = [];
  for (const entry of manifest.sources) {
    if ("optional" in (entry as any)) {
      for (const opt of (entry as any).optional) {
        const p = path.resolve(baseDir, opt.path);
        if (await exists(p)) {
          log("• Lade optional:", p);
          records.push(...asTaskArray(await loadYamlOrJson(p)));
        } else {
          log("• Überspringe optional:", p);
        }
      }
    } else {
      const p = path.resolve(baseDir, (entry as any).path);
      if (!(await exists(p))) {
        console.warn(`! Quelle fehlt: ${p}`);
        continue;
      }
      log("• Lade:", p);
      records.push(...asTaskArray(await loadYamlOrJson(p)));
    }
  }
  if (records.length === 0) {
    console.error("✖ Keine Tasks in Quellen gefunden.");
    process.exit(1);
  }

  // 2) Normalize + validate
  const ajv = await useAjv();
  const validate = ajv.compile(taskSchema);
  const normalized: FraktalTask[] = [];
  for (const r of records) {
    const t = applyMapping(r, mapping) as FraktalTask;

    if (!t.id || !t.title) {
      console.warn(`! Überspringe Task ohne id/title:`, t);
      continue;
    }
    // sensible Defaults
    t.status = (t.status || "open") as FraktalTask["status"];
    t.priority = clamp(Number(t.priority || 3), 1, 5);

    if (!validate(t)) {
      console.warn(`! Schemafehler für ${t.id}:`, ajv.errorsText(validate.errors));
      continue;
    }
    normalized.push(t);
  }

  if (normalized.length === 0) {
    console.error("✖ Nach Normalisierung keine gültigen Tasks.");
    process.exit(1);
  }

  // 3) Dedupe + Score
  const dedupeKeys = manifest.policies?.dedupe?.keys || ["title", "id", "slug"];
  const strategy = manifest.policies?.dedupe?.strategy || "keep-highest-priority";
  let tasks = dedupe(normalized, dedupeKeys, strategy);
  tasks = scoreTasks(tasks, manifest.policies?.priority?.weights || {});

  // 4) Output
  const outPath = path.resolve(baseDir, "..", manifest.output.normalized_tasks);
  const header = "⚠️ Diese Datei wird von Fraktalrun generiert/überschrieben.";
  const outData = { tasks: tasks.map((t) => ({ ...t })) };
  if (dryRun || manifest.runtime?.dryRun) {
    console.log("--- DRY RUN (tasks/fractal_tasks.yaml) ---\n", outData);
  } else {
    await writeYaml(outPath, outData, header);
    console.log("✓ geschrieben:", path.relative(process.cwd(), outPath));
  }

  // 5) Progress-Journal
  const journalRel = manifest.output.progress_journal;
  if (journalRel) {
    const journalPath = path.resolve(baseDir, "..", journalRel);
    let j: AnyRec = {};
    if (await exists(journalPath)) {
      try {
        j = JSON.parse(await readFile(journalPath, "utf8"));
      } catch {
        console.warn("! Konnte advancedprogress.json nicht lesen – starte neu.");
      }
    }
    j.tasks = j.tasks || {};
    const now = new Date().toISOString();
    for (const t of tasks) {
      j.tasks[t.id] = {
        ...(j.tasks[t.id] || {}),
        status: t.status,
        priority: t.priority,
        score: t.score,
        title: t.title,
        updatedAt: now,
      };
    }
    if (dryRun || manifest.runtime?.dryRun) {
      console.log("--- DRY RUN (advancedprogress.json) ---\n", j);
    } else {
      await writeFile(journalPath, JSON.stringify(j, null, 2), "utf8");
      console.log("✓ aktualisiert:", path.relative(process.cwd(), journalPath));
    }
  }

  // 6) (Optional) Dispatch – hier nur Log (Routing macht euer Codex/CI)
  for (const t of tasks.slice(0, 10)) {
    const routes = [
      t.labels?.includes("code") ? "CodeAgent" : null,
      t.component === "go-bridge" ? "GoBridge" : null,
      t.labels?.includes("crep") ? "Fourier" : null,
    ].filter(Boolean);
    if (routes.length) log(`→ route ${t.id} -> ${routes.join(", ")}`);
  }

  console.log(`✓ Fertig. ${tasks.length} Tasks normalisiert${dryRun ? " (dry-run)" : ""}.`);
}

main().catch((e) => {
  console.error("✖ Fehler:", e);
  process.exit(1);
});

