import fs from 'fs';
import path from 'path';
import { templates, TemplateName } from '../packages/instances/Templates';

const instancesDir = path.resolve(__dirname, '..', 'instances');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function clone(templateName: TemplateName, instanceName: string) {
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Unknown template: ${templateName}`);
  }
  ensureDir(instancesDir);
  const target = path.join(instancesDir, instanceName);
  fs.cpSync(template.source, target, { recursive: true });
  console.log(`Cloned ${templateName} to ${target}`);
}

function list() {
  if (!fs.existsSync(instancesDir)) {
    console.log('No instances available');
    return;
  }
  const entries = fs
    .readdirSync(instancesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  if (entries.length === 0) {
    console.log('No instances available');
  } else {
    console.log(entries.join('\n'));
  }
}

function usage() {
  console.log('Usage: node scripts/instance-registry.ts <clone|list> [args]');
  console.log('  clone <template> <instance>  Clone template into instances directory');
  console.log('  list                         List existing instances');
}

const [cmd, tmpl, name] = process.argv.slice(2) as [string, TemplateName, string];

try {
  if (cmd === 'clone') {
    if (!tmpl || !name) {
      usage();
      process.exit(1);
    }
    clone(tmpl, name);
  } else if (cmd === 'list') {
    list();
  } else {
    usage();
    process.exit(1);
  }
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
