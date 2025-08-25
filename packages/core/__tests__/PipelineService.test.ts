import { PipelineService } from '../PipelineService';
import { LocalEventBus, Subjects } from '../../event-bus';

test('runs steps sequentially and emits events', async () => {
  const bus = new LocalEventBus();
  const events: number[] = [];
  bus.subscribe(Subjects.LIVE_ASK, (payload) => {
    events.push(payload as number);
  });

  const svc = new PipelineService<number>({ bus, subject: Subjects.LIVE_ASK });
  svc.use((n) => n + 1);
  svc.use(async (n) => n * 2);

  const result = await svc.run(1);
  expect(result).toBe(4);
  expect(events).toEqual([2, 4]);
});
