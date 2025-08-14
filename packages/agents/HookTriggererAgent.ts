import fetch from 'node-fetch';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class HookTriggererAgent implements Agent {
  id = 'HookTriggerer';
  layer: 'Aeon' = 'Aeon';
  constructor(private request: typeof fetch = fetch) {
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const urls = Array.isArray((task as any).urls)
      ? (task as any).urls
      : (task as any).url
      ? [(task as any).url]
      : [];
    const method = (task as any).method || 'POST';

    for (const url of urls) {
      try {
        const res = await this.request(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        if (!res.ok) {
          console.error(
            `HookTriggerer error for ${task.id} [${url}]: ${res.status}`
          );
        }
      } catch (err) {
        console.error(`HookTriggerer error for ${task.id} [${url}]:`, err);
      }
    }

    console.log(`🔔 HookTriggerer → Trigger für ${task.id}`);
  }
}
