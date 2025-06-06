#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const Ajv = require('ajv');
const schema = require('../genesis-sigillin-core/schemas/sigillin.schema.json');
const YAML = require('yaml');
let splitFile;
try {
  ({ splitFile } = require('../../dist/shared-utils/textFragmenter.js'));
} catch {
  ({ splitFile } = require('../shared-utils/textFragmenter'));
}
let SigillinGenerator;
try {
  // use compiled version if available
  ({ SigillinGenerator } = require('../../dist/genesis-sigillin-core/SigillinGenerator.js'));
} catch (e) {
  ({ SigillinGenerator } = require('../genesis-sigillin-core/SigillinGenerator'));
}

program
  .command('validate <file>')
  .description('Validiert eine Sigillin-YAML/JSON Datei gegen das Schema')
  .action((file) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const content = fs.readFileSync(file, 'utf8');
    const data = file.endsWith('.yaml') || file.endsWith('.yml')
      ? YAML.parse(content)
      : JSON.parse(content);
    if (!validate(data)) {
      console.error(validate.errors);
      process.exit(1);
    }
    console.log('Sigillin-Datei gültig.');
  });

program
  .command('init <id> <type>')
  .description('Erzeugt neues Sigillin-Template')
  .action((id, type) => {
    const template = SigillinGenerator(id, type, 'draft', 'GenesisGPT');
    fs.writeFileSync(`${id}.sigil.json`, JSON.stringify(template, null, 2));
    console.log(`Sigillin ${id}.sigil.json erstellt.`);
  });

program
  .command('list')
  .description('Listet vorhandene *.sigil.json Dateien im Projekt')
  .action(() => {
    const glob = require('glob');
    const files = glob.sync('**/*.sigil.json', { ignore: 'node_modules/**' });
    console.log('Gefundene Sigillin-Dateien:');
    files.forEach(f => console.log(' -', f));
  });

program
  .command('convert <input> [output]')
  .description('Konvertiert zwischen YAML und JSON')
  .action((input, output) => {
    const content = fs.readFileSync(input, 'utf8');
    let data;
    let targetFile;
    if (input.endsWith('.yaml') || input.endsWith('.yml')) {
      data = YAML.parse(content);
      targetFile = output || input.replace(/\.ya?ml$/, '.json');
      fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
    } else {
      data = JSON.parse(content);
      targetFile = output || input.replace(/\.json$/, '.yaml');
      fs.writeFileSync(targetFile, YAML.stringify(data));
    }
    console.log(`Konvertiert -> ${targetFile}`);
  });

program
  .command('graph')
  .description('Erzeugt eine Mermaid-Datei aller Sigillin-Verkn\xFCpfungen')
  .option('--json', 'JSON-Ausgabe statt Mermaid')
  .action((opts) => {
    const glob = require('glob');
    const sigilFiles = glob.sync('**/*.sigil.json', { ignore: 'node_modules/**' });
    const sigils = sigilFiles.map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
    if (opts.json) {
      fs.writeFileSync('sigillin-graph.json', JSON.stringify(sigils, null, 2));
      console.log('sigillin-graph.json erstellt');
      return;
    }
    let out = 'graph TD\n';
    sigils.forEach(s => {
      (s.related_sigils || []).forEach(r => {
        out += `  ${s.id} -->|${r.relation}| ${r.id}\n`;
      });
    });
    fs.writeFileSync('sigillin-relations.mmd', out);
    console.log('sigillin-relations.mmd erstellt');
  });

program
  .command('fragment <file>')
  .option('-s, --size <size>', 'Fragmentlänge', '1000')
  .description('Zerlegt eine Textdatei in handliche Fragmente')
  .action((file, opts) => {
    const size = parseInt(opts.size, 10);
    const chunks = splitFile(file, size);
    chunks.forEach((chunk, i) => {
      console.log(`--- Fragment ${i + 1} ---`);
      console.log(chunk);
    });
  });

program
  .command('todo-sigil [source]')
  .description('Generiert docs/sigils/todo-sigil.yaml aus MasterCanvas oder anderer Datei')
  .action((source = 'docs/mastercanvas.yaml') => {
    const path = require('path');
    let generateTodoSigilFromFile;
    try {
      ({ generateTodoSigilFromFile } = require('../../dist/shared-utils/todoSigilGenerator.js'));
    } catch {
      ({ generateTodoSigilFromFile } = require('../shared-utils/todoSigilGenerator'));
    }
    generateTodoSigilFromFile(
      path.resolve(source),
      path.join('docs/sigils/todo-sigil.yaml')
    );
    console.log('todo-sigil.yaml aktualisiert.');
  });

program
  .command('todo-update [file]')
  .description('Pr\xFCft und aktualisiert Status im todo-sigil.yaml')
  .action(async (file = 'docs/sigils/todo-sigil.yaml') => {
    const path = require('path');
    let updateTodoSigilStatus;
    try {
      ({ updateTodoSigilStatus } = require('../../dist/shared-utils/todoSigilUpdater.js'));
    } catch {
      ({ updateTodoSigilStatus } = require('../shared-utils/todoSigilUpdater'));
    }
    const { checks } = require('../../scripts/check-todo-sigil');
    await updateTodoSigilStatus(path.resolve(file), checks);
    console.log('todo-sigil.yaml Status gepr\xFCft und aktualisiert.');
  });

program.parse(process.argv);
