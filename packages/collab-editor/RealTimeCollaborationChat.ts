import { EventEmitter } from 'events';

export class RealTimeCollaborationChat extends EventEmitter {
  send(user: string, msg: string) {
    this.emit('message', { user, msg });
  }
}
