import mitt from 'mitt';

const bus = mitt();

export function push(data: any) {
  bus.emit('push', data);
}

export function pull() {
  let result: any;
  bus.on('push', (d) => {
    result = d;
  });
  return result;
}

export default { push, pull };
