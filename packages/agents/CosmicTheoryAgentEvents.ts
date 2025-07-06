import mitt, { Emitter } from 'mitt';

export type CosmicTheoryAgentEvents = {
  'sigil:generated': { sigilId: string; formula: string };
  'theory:updated': { formula: string; score: number };
  'trace:log': { message: string; timestamp: number };
  [key: string]: any;
};

export const CosmicTheoryEventHub: Emitter<CosmicTheoryAgentEvents> = mitt<CosmicTheoryAgentEvents>();
