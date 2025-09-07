import Ajv from 'ajv';
import schema from '../../../schemas/eventbus.message.schema.json';
import personhoodPolicies from '../../../policies/personhood-levels.json';
import { EventMessage, PersonhoodLevel } from './types';

const ajv = new Ajv();
const validate = ajv.compile<EventMessage>(schema);

type Handler<T = any> = (payload: T) => void;
const handlers: Record<string, Handler[]> = {};

const LEVELS: PersonhoodLevel[] = ['P0', 'P1', 'P2', 'P3'];

function levelAllowed(provided: PersonhoodLevel, required: PersonhoodLevel) {
  return LEVELS.indexOf(provided) >= LEVELS.indexOf(required);
}

export function on(topic: string, handler: Handler) {
  handlers[topic] = handlers[topic] || [];
  handlers[topic].push(handler);
}

interface EmitOptions {
  personhood?: PersonhoodLevel;
  crep_resonance?: number;
  sigil?: string;
  governance?: EventMessage['governance'];
}

export function emit<T>(topic: string, payload: T, options: EmitOptions = {}) {
  const message: EventMessage<T> = {
    topic,
    payload,
    crep_resonance: options.crep_resonance,
    sigil: options.sigil,
    governance: options.governance,
  };

  if (!validate(message)) {
    throw new Error('schema validation failed: ' + ajv.errorsText(validate.errors));
  }

  const required = (personhoodPolicies as Record<string, PersonhoodLevel>)[topic] || 'P0';
  const provided = options.personhood || 'P0';
  if (!levelAllowed(provided, required)) {
    throw new Error(`personhood level ${provided} insufficient for topic ${topic}`);
  }

  (handlers[topic] || []).forEach((h) => h(payload));
  return message;
}

export type { EventMessage, GovernanceInfo, PersonhoodLevel } from './types';
