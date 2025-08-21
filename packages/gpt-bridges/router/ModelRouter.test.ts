import { ModelRouter } from './ModelRouter';
import { ModelProvider } from '../providers/ModelProvider';

class StubProvider implements ModelProvider {
  constructor(public name: string) {}
  async generate(model: string, prompt: string): Promise<string> {
    return `${this.name}:${model}:${prompt}`;
  }
}

describe('ModelRouter', () => {
  test('routes requests to the correct provider', async () => {
    const a = new StubProvider('a');
    const b = new StubProvider('b');
    const router = new ModelRouter([a, b]);
    await expect(router.generate('a', 'm1', 'hi')).resolves.toBe('a:m1:hi');
    await expect(router.generate('b', 'm2', 'yo')).resolves.toBe('b:m2:yo');
  });

  test('throws on unknown provider', async () => {
    const router = new ModelRouter([new StubProvider('a')]);
    await expect(router.generate('x', 'm', 'p')).rejects.toThrow('Unknown provider: x');
  });
});
