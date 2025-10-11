import { io, Socket } from 'socket.io-client';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class CREPMultiSync {
  private socket?: Socket;

  connect(url = 'ws://localhost:4000') {
    this.socket = io(url);
    this.socket.on('crep-update', (data) => {
      GPTEventHub.emit('crep:sync', data);
    });
  }

  sendUpdate(data: unknown) {
    this.socket?.emit('crep-update', data);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
