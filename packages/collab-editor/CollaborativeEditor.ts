import { EventEmitter } from 'events';
import { sendUpdate } from './federationRoutes';

export class CollaborativeEditor extends EventEmitter {
  private content = '';

  constructor(private endpoint?: string) {
    super();
    this.on('update', (text: string) => {
      if (this.endpoint) {
        sendUpdate(this.endpoint, text);
      }
    });
  }

  applyLocalChange(text: string): void {
    this.content = text;
    this.emit('update', this.content);
  }

  applyRemoteChange(text: string): void {
    this.content = text;
  }

  getContent(): string {
    return this.content;
  }
}
