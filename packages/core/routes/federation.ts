import mitt from 'mitt';

const bus = mitt();
let last: any;

export function push(data: any) {
  last = data;
  bus.emit('push', data);
}

export function pull() {
  return last;
}

export default { push, pull };
