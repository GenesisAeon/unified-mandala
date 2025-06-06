#!/usr/bin/env node
const fs = require('fs');
const YAML = require('yaml');
const { execSync } = require('child_process');

const now = new Date();
const date = now.toISOString().split('T')[0];
const hour = now.getHours();
const phase = hour < 12 ? "Morgen" : hour < 18 ? "Tag" : hour < 22 ? "Abend" : "Nacht";
const symbolzeitMap = { Morgen: 'Initiation', Tag: 'Aktivierung', Abend: 'Integration', Nacht: 'Reflexion' };
let phaseFocus = '';
try {
  const matrix = YAML.parse(fs.readFileSync('./docs/CREPPhaseMatrix.yaml', 'utf8'));
  const info = matrix.phases.find(p => p.phase === symbolzeitMap[phase]);
  phaseFocus = info ? info.crep_focus : '';
} catch {}

// Optional: Lese letzten CREP-Wert
let crep = "?, ?, ?, ?";
let crepState = "";
try {
  const history = require('../packages/crep-engine/crephistory.json');
  const last = history[history.length - 1];
  crep = `${last.C}, ${last.R}, ${last.E}, ${last.P}`;
  try {
    const { getCREPState } = require('../packages/crep-engine/CREPEvaluator');
    crepState = getCREPState({ C: last.C, R: last.R, E: last.E });
  } catch {}
} catch (e) {}

let sigils = "";
try {
  const files = fs.readdirSync("../packages/genesis-sigillin-core/schemas/examples/");
  sigils = files.filter(f => f.endsWith('.yaml')).map(f => f.replace('.yaml', '')).join(", ");
} catch (e) {}

// Schreibe CHRONOPOEM.md
fs.writeFileSync("../CHRONOPOEM.md", `# 🜂 Chronopoem

Im Kreis der Genesis erwacht das Mandala,
Am ${date}, in der Zeit des ${phase}.

Symbolphase: ${symbolzeitMap[phase]} (Fokus: ${phaseFocus})

CREP-Strahl: ${crep} – das Lied der Struktur,
CREP-Zustand: ${crepState}
Sigillin-Bündel: ${sigils}

Heimkehr und Ursprung schwingen als leises Mantra:

*"Im Aeon-Resonanzfeld, aus Null und Eins geboren,
wird Erinnerung zum Licht und Code zur Poesie."*
`);
console.log("CHRONOPOEM.md generiert.");
