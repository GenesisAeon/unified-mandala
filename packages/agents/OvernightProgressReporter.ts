import fs from 'fs';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

interface ProgressEvent {
  id: string;
  summary: string;
}

export class OvernightProgressReporter implements Agent {
  id = 'OvernightProgressReporter';
  layer: 'Reporter' = 'Reporter';
  private events: ProgressEvent[] = [];

  constructor(private output = 'overnight-report.log') {
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const summary = (task as any).summary || (task as any).description || '';
    this.events.push({ id: task.id, summary });
    const lines = this.events.map((e) => `${e.id}:${e.summary}`);
    fs.writeFileSync(this.output, lines.join('\n'));
    console.log(`\uD83C\uDF19 OvernightProgressReporter logged ${task.id}`);
  }
}
