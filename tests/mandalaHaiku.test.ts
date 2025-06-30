/* @jest-environment node */
import { getPlugin } from '../services/plugin-loader';
import { EventEmitter } from 'events';

describe('mandalaHaiku plugin', () => {
  it('emits haiku_response on high-energy alert', (done) => {
    const plugin = getPlugin('mandalaHaiku');
    expect(plugin).toBeDefined();

    const socket = new EventEmitter();
    const io = { on: (_evt: string, handler: any) => handler(socket) } as any;
    const logs: string[] = [];
    plugin.initialize({ io, logger: (msg: string) => logs.push(msg) });

    socket.on('haiku_response', (data: any) => {
      expect(typeof data.haiku).toBe('string');
      done();
    });

    socket.emit('sigil_alert', { id: 'aeon:2025-0626-HIGH-ENERGY', crep: {} });
  });
});
