import { EventEmitter } from 'events';

export class WebhookSystem extends EventEmitter {
  trigger(event: string, payload: any) {
    this.emit(event, payload);
  }
}
