import mitt from 'mitt';

export type MandalaEventMap = {
  'mandala:export-svg': { svg: string };
};

const emitter = mitt<MandalaEventMap>();

export default {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
};
