import mitt from 'mitt';

export type CosmicBridgeEvents = {
  'sigil:alert': { type: string; message: string };
};

const emitter = mitt<CosmicBridgeEvents>();

export function connectCosmicBridge(url = 'ws://localhost:4000/sigil'): WebSocket {
  const ws = new WebSocket(url);
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      emitter.emit('sigil:alert', data);
    } catch (e) {
      console.error('Invalid sigil alert', e);
    }
  };
  return ws;
}

export default {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
  connect: connectCosmicBridge,
};
