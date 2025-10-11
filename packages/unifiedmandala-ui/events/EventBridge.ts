import mitt from 'mitt';
import { CosmicTheoryEventHub } from '../../agents/CosmicTheoryAgentEvents';

export type UIEventMap = {
  'theory:update': { formula: string; score: number };
  [key: string]: any;
};

const bridge = mitt<UIEventMap>();

CosmicTheoryEventHub.on('theory:updated', (payload) => {
  bridge.emit('theory:update', payload);
});

export default bridge;
