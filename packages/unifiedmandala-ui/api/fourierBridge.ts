import mitt from 'mitt';

export type FourierBridgeEvents = {
  'fourier:metrics': any;
  'fourier:metrics-svg': { id: string; svg: string };
};

const emitter = mitt<FourierBridgeEvents>();

export function connectFourierBridge(url = 'ws://localhost:4010'): WebSocket {
  const ws = new WebSocket(url);
  ws.onmessage = (ev) => {
    try {
      const message = JSON.parse(ev.data);
      if (message.type === 'fourier-metrics') {
        emitter.emit('fourier:metrics', message.data);
      } else if (message.type === 'fourier-metrics-svg') {
        emitter.emit('fourier:metrics-svg', message.data);
      }
    } catch (e) {
      console.error('Invalid fourier metrics message', e);
    }
  };
  return ws;
}

export default {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
  connect: connectFourierBridge,
};
