import { EventEmitter } from 'events';
import NodeWebSocket from 'ws';

type WebSocket = NodeWebSocket | globalThis.WebSocket;

export interface SealCoreOptions {
  url: string;
}

export type SealCoreEvent = { event: string; payload: any };

export class SealCore extends EventEmitter {
  private ws?: WebSocket;
  constructor(private options: SealCoreOptions) {
    super();
  }

  async connect() {
    const Impl: any =
      typeof globalThis.WebSocket !== 'undefined' ? globalThis.WebSocket : NodeWebSocket;
    const ws: any = new Impl(this.options.url);
    this.ws = ws as WebSocket;
    const handleMsg = (data: any) => {
      try {
        const text = typeof data === 'string' ? data : data.toString();
        const msg = JSON.parse(text) as SealCoreEvent;
        this.emit(msg.event, msg.payload);
      } catch (err) {
        this.emit('error', err);
      }
    };
    if (typeof ws.on === 'function') {
      ws.on('message', handleMsg);
      return new Promise<void>((resolve, reject) => {
        ws.on('open', () => resolve());
        ws.on('error', (err: any) => reject(err));
      });
    } else {
      ws.onmessage = (ev: any) => handleMsg(ev.data);
      return new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = (err: any) => reject(err);
      });
    }
  }

  send(event: string, payload: any) {
    this.ws?.send(JSON.stringify({ event, payload }));
  }

  close() {
    this.ws?.close();
  }
}
