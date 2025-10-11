import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import yaml from 'js-yaml';

const ajv = new Ajv({ allErrors: true, strict: false });

export function loadSchema() {
  const p = path.join(process.cwd(), 'schemas', 'eventbus.message.schema.json');
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

export function validateEvent(evt: any) {
  const schema = loadSchema();
  const validate = ajv.compile(schema as any);
  const ok = validate(evt);
  if (!ok)
    throw new Error('Event schema invalid: ' + JSON.stringify((validate as any).errors, null, 2));
}

export function loadPolicies() {
  const y = path.join(process.cwd(), 'policies', 'personhood-levels.yaml');
  const j = path.join(process.cwd(), 'policies', 'personhood-levels.json');
  if (fs.existsSync(y)) return yaml.load(fs.readFileSync(y, 'utf-8')) as any;
  if (fs.existsSync(j)) return JSON.parse(fs.readFileSync(j, 'utf-8'));
  return { gates: [] };
}

export function checkPersonhood(topic: string, personhood?: string) {
  const policy = loadPolicies();
  const gates = policy.gates || [];
  const gate = gates.find((g: any) => {
    if (g.topic?.endsWith('.*')) {
      const prefix = g.topic.slice(0, -2);
      return topic.startsWith(prefix);
    }
    return g.topic === topic;
  });
  if (!gate) return;
  const levels = ['P0', 'P1', 'P2', 'P3'];
  const have = levels.indexOf(personhood || 'P0');
  const need = levels.indexOf(gate.min_level);
  if (have < need)
    throw new Error(
      `Personhood gate: '${topic}' requires >= ${gate.min_level}, have ${personhood || 'P0'}`,
    );
}
