import { Agent, Task } from '../core/interfaces';

export class NightWorkScheduler implements Agent {
  id = 'NightWorkScheduler';
  layer: 'Scheduler' = 'Scheduler';
  private queue: Task[] = [];

  constructor(
    private dispatch: (task: Task) => Promise<void> = async () => {},
    private startHour = 0,
    private endHour = 6,
    private now: () => Date = () => new Date(),
  ) {}

  private isNight() {
    const h = this.now().getHours();
    return h >= this.startHour && h < this.endHour;
  }

  async handle(task: Task): Promise<void> {
    if (this.isNight()) {
      await this.dispatch(task);
    } else {
      this.queue.push(task);
    }
  }

  processQueue(): void {
    if (this.isNight()) {
      while (this.queue.length) {
        const t = this.queue.shift()!;
        this.dispatch(t);
      }
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
