import { io } from 'socket.io-client';
const socket = io(process.env.WEBSOCKET_URL || '');
const bc = new BroadcastChannel('sigillin-sync');

export const syncSigillinStatus = (id: string, status: string) => {
  if (socket.connected) socket.emit('updateSigillinStatus', { id, status });
  else bc.postMessage({ id, status });
};

socket.on('sigillinStatusUpdated', (data) => bc.postMessage(data));
bc.onmessage = (msg) => console.log('Status update (BC):', msg.data);
