import { Agent, Task } from '../core/interfaces';
import { NightWorkScheduler } from './NightWorkScheduler';
import { OvernightProgressReporter } from './OvernightProgressReporter';

export class OvernightWorkerAgent implements Agent {
  id = 'OvernightWorkerAgent';
  layer: 'Worker' = 'Worker';
  private scheduler: NightWorkScheduler;
  private reporter: OvernightProgressReporter;

  constructor(
    private dispatch: (task: Task) => Promise<void> = async () => {},
    output = 'overnight-report.log',
    now: () => Date = () => new Date(),
  ) {
    this.reporter = new OvernightProgressReporter(output);
    this.scheduler = new NightWorkScheduler(
      async (task: Task) => {
        await this.dispatch(task);
        await this.reporter.handle(task);
      },
      0,
      6,
      now,
    );
  }

  async handle(task: Task): Promise<void> {
    await this.scheduler.handle(task);
  }

  async process(): Promise<void> {
    this.scheduler.processQueue();
    await new Promise((r) => setImmediate(r));
  }

  getQueueLength(): number {
    return this.scheduler.getQueueLength();
  }
}
