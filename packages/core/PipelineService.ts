import { LocalEventBus, Subjects } from '../event-bus';

export type PipelineStep<T> = (context: T) => Promise<T> | T;

export interface PipelineServiceOptions<T> {
  steps?: PipelineStep<T>[];
  bus?: LocalEventBus;
  subject?: Subjects;
}

/**
 * PipelineService runs registered steps sequentially and optionally publishes
 * intermediate results to an event bus. It provides a lightweight mechanism to
 * compose message processing pipelines while emitting progress to observers.
 */
export class PipelineService<T> {
  private steps: PipelineStep<T>[];
  private bus?: LocalEventBus;
  private subject?: Subjects;

  constructor(options: PipelineServiceOptions<T> = {}) {
    this.steps = options.steps ?? [];
    this.bus = options.bus;
    this.subject = options.subject;
  }

  use(step: PipelineStep<T>): void {
    this.steps.push(step);
  }

  async run(initial: T): Promise<T> {
    let ctx = initial;
    for (const step of this.steps) {
      ctx = await step(ctx);
      if (this.bus && this.subject) {
        this.bus.publish(this.subject, ctx);
      }
    }
    return ctx;
  }
}
