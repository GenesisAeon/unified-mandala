/** @jest-environment node */
import WebSocket from 'ws';
import { LocalEventBus, Subjects } from '../event-bus';
import { ResearchHubWS } from './ResearchHubWS';
import { wrap } from './StreamProtocol';

describe('ResearchHubWS', () => {
  it('forwards bus events to subscribed clients', async () => {
    const bus = new LocalEventBus();
    const server = new ResearchHubWS({ port: 0, bus });
    const addr = server.address();
    if (typeof addr !== 'object' || addr === null) throw new Error('no address');
    const port = (addr as any).port;
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    await new Promise((res) => ws.on('open', res));
    ws.send(JSON.stringify(wrap({ type: 'subscribe', channel: Subjects.LIVE_ANSWER })));
    const message = new Promise<any>((resolve) => {
      ws.on('message', (data) => resolve(JSON.parse(data.toString())));
    });
    await new Promise((r) => setTimeout(r, 10));
    bus.publish(Subjects.LIVE_ANSWER, { text: 'hi' });
    const payload = await message;
    expect(payload.msg.payload).toEqual({ text: 'hi' });
    ws.close();
    server.close();
  });
});
