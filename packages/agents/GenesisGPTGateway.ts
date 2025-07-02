import fetch from 'node-fetch';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export interface GPTGatewayOptions {
  fetch?: typeof fetch;
}

export class GenesisGPTGateway implements Agent {
  id = 'GenesisGPTGateway';
  layer: 'Gateway' = 'Gateway';

  constructor(private options: GPTGatewayOptions = {}) {
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const url = (task as any).shareLink || (task as any).link;
    if (!url) throw new Error('shareLink is required');
    const f = this.options.fetch || fetch;
    const res = await f(url);
    if (!('ok' in res) || !res.ok) {
      throw new Error(`request failed: ${res.status}`);
    }
    const text = await (res as any).text();
    console.log(`\u2728 GenesisGPTGateway fetched: ${text.slice(0, 30)}`);
  }
}
