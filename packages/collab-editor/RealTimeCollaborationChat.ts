import { EventEmitter } from 'events';

export interface ChatMessage {
  user: string;
  msg: string;
  ts: number;
}

/**
 * Simple in-memory real-time chat used during collaborative editing.
 * It keeps a history of messages and emits join/leave events so that the
 * PresenceIndicator can react accordingly.
 */
export class RealTimeCollaborationChat extends EventEmitter {
  private history: ChatMessage[] = [];

  join(user: string) {
    this.emit('join', user);
  }

  leave(user: string) {
    this.emit('leave', user);
  }

  send(user: string, msg: string) {
    const entry: ChatMessage = { user, msg, ts: Date.now() };
    this.history.push(entry);
    this.emit('message', entry);
  }

  getHistory(): ChatMessage[] {
    return [...this.history];
  }
}
