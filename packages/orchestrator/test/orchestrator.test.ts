import { describe, it, expect, vi } from 'vitest';

// Mock socket.io Server to capture handlers and simulate a client
vi.mock('socket.io', () => {
  const instances: any[] = [];
  class MockServer {
    public handlers: Record<string, Function> = {};
    constructor(_server: any) {
      instances.push(this);
    }
    on(event: string, cb: Function) {
      this.handlers[event] = cb;
    }
  }
  return { Server: MockServer, __instances: instances } as any;
});

import { AeonOrchestrator } from '../src/index';
import * as sio from 'socket.io';

describe('AeonOrchestrator', () => {
  it('emits welcome on new connection', () => {
    const orch = new AeonOrchestrator({} as any);
    orch.start();
    const inst = (sio as any).__instances.at(-1);
    const socket = { emit: vi.fn() } as any;
    inst.handlers['connection'](socket);
    expect(socket.emit).toHaveBeenCalledWith('welcome', 'Aeon Orchestrator active');
  });
});

