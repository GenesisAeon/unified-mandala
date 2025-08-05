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
    const url = (task as any).url;
    if (url) {
      try {
        await this.request(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
      } catch (err) {
        console.error(`HookTriggerer error for ${task.id}:`, err);
      }
    }
    console.log(`🔔 HookTriggerer → Trigger für ${task.id}`);
  }
}
