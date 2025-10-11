import { CREPMultiSync } from './CREPMultiSync';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';
import { io as ioClient, Socket } from 'socket.io-client';

jest.mock('socket.io-client');
const mockIo = ioClient as unknown as jest.Mock;

it('emits crep sync events from socket', () => {
  const handlers: Record<string, (d: any) => void> = {};
  const socket = {
    on: jest.fn((ev, cb) => {
      handlers[ev] = cb;
    }),
    emit: jest.fn(),
    disconnect: jest.fn(),
  } as unknown as Socket;
  mockIo.mockReturnValue(socket);
  jest.spyOn(GPTEventHub, 'emit');

  const sync = new CREPMultiSync();
  sync.connect('ws://test');
  handlers['crep-update']({ C: 1 });

  expect(GPTEventHub.emit).toHaveBeenCalledWith('crep:sync', { C: 1 });
});

it('sends updates via socket', () => {
  const socket = { on: jest.fn(), emit: jest.fn(), disconnect: jest.fn() } as unknown as Socket;
  mockIo.mockReturnValue(socket);

  const sync = new CREPMultiSync();
  sync.connect();
  sync.sendUpdate({ C: 2 });

  expect(socket.emit).toHaveBeenCalledWith('crep-update', { C: 2 });
});
