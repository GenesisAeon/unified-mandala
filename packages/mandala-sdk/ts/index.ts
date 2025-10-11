import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { MandalaEvent } from './types.js';

const ajv = new Ajv({ allErrors: true, strict: false });
const schemaPath = path.join(process.cwd(), 'schemas', 'eventbus.message.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const validate = ajv.compile(schema as any);

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadGate() {
  const p = path.join(process.cwd(), 'policies', 'personhood-levels.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return { gates: [] };
  }
}

function checkGate(topic: string, personhood?: string) {
  const policy = loadGate();
  const gate = (policy.gates || []).find((g: any) => {
    if (g.topic.endsWith('.*')) {
      const prefix = g.topic.slice(0, -2);
      return topic.startsWith(prefix);
    }
    return g.topic === topic;
  });
  if (!gate) return;
  const levels = ['P0', 'P1', 'P2', 'P3'];
  const have = levels.indexOf((personhood || 'P0') as string);
  const need = levels.indexOf(gate.min_level);
  if (have < need)
    throw new Error(
      `Personhood gate: topic '${topic}' requires >= ${gate.min_level}, have ${personhood || 'P0'}`,
    );
}

const handlers = new Map<string, Array<(e: MandalaEvent) => void>>();

export async function emit<T = any>(
  topic: string,
  payload: T,
  opts?: { personhood?: string; actor?: { id: string; role: string } },
): Promise<MandalaEvent<T>> {
  checkGate(topic, opts?.personhood);
  const evt: MandalaEvent<T> = {
    id: uuid(),
    topic,
    actor: opts?.actor || { id: 'system', role: 'agent' },
    ts: new Date().toISOString(),
    personhood: opts?.personhood as any,
    payload,
  };
  const ok = validate(evt);
  if (!ok) {
    throw new Error('Event schema invalid: ' + JSON.stringify((validate as any).errors, null, 2));
  }
  (handlers.get(topic) || []).forEach((fn) => fn(evt));
  return evt;
}

export function on<T = any>(topic: string, fn: (e: MandalaEvent<T>) => void) {
  const list = handlers.get(topic) || [];
  list.push(fn as any);
  handlers.set(topic, list);
}
