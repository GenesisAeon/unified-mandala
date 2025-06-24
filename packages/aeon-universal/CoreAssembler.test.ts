import { AeonCoreAssembler } from './CoreAssembler';
import { Agent, Task } from '../core/interfaces';

class MockAgent implements Agent {
  id = 'Mock';
  layer = 'Aeon';
  received: Task[] = [];
  async handle(task: Task) { this.received.push(task); }
}

describe('AeonCoreAssembler', () => {
  it('dispatches compiled tasks to registered agents', async () => {
    const assembler = new AeonCoreAssembler();
    const agent = new MockAgent();
    assembler.register(agent);
    await assembler.processSource('TASK Demo');
    expect(agent.received.length).toBe(1);
    expect(agent.received[0].description).toBe('Demo');
  });

  it('honors allowedAgents list', async () => {
    const assembler = new AeonCoreAssembler(['Allowed']);
    const agent = new MockAgent();
    assembler.register(agent); // not allowed
    await assembler.processSource('TASK Demo');
    expect(agent.received.length).toBe(0);
  });
});
