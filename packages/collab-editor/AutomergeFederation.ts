import { EventEmitter } from 'events';

export interface SyncStatus {
  lastSync: number;
  pending: boolean;
}

export class AutomergeFederation extends EventEmitter {
  private document = '';
  private status: SyncStatus = { lastSync: 0, pending: false };

  applyLocalChange(text: string): void {
    this.document = text;
    this.status.pending = true;
    this.emit('localChange', text);
  }

  mergeRemoteChange(text: string): void {
    this.document = text;
    this.status.lastSync = Date.now();
    this.status.pending = false;
    this.emit('sync', this.status);
  }

  getDocument(): string {
    return this.document;
  }

  getStatus(): SyncStatus {
    return this.status;
  }
}
