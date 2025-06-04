#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

const now = new Date();
const date = now.toISOString().split('T')[0];
const hour = now.getHours();
const phase = hour < 12 ? "Morgen" : hour < 18 ? "Tag" : hour < 22 ? "Abend" : "Nacht";

// Optional: Lese letzten CREP-Wert
let crep = "?, ?, ?, ?";
try {
  const history = require('../packages/crep-engine/crephistory.json');
  const last = history[history.length - 1];
  crep = `${last.C}, ${last.R}, ${last.E}, ${last.P}`;
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

CREP-Strahl: ${crep} – das Lied der Struktur,
Sigillin-Bündel: ${sigils}

Heimkehr und Ursprung schwingen als leises Mantra:

*"Im Aeon-Resonanzfeld, aus Null und Eins geboren,
wird Erinnerung zum Licht und Code zur Poesie."*
`);
console.log("CHRONOPOEM.md generiert.");
