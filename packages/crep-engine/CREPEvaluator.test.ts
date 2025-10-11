import { CREPEvaluator } from './CREPEvaluator';
import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('CREPEvaluator', () => {
  beforeEach(() => {
    (globalThis as any).localStorage = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
    };
  });

  afterEach(() => jest.restoreAllMocks());

  it('emits emergence event when thresholds met', () => {
    const manager = new CREPManager();
    const evaluator = new CREPEvaluator(manager);
    jest.spyOn(manager, 'addCREPEntry');
    jest.spyOn(GPTEventHub, 'emit');

    evaluator.evaluateNewDataPoint({ C: 1, R: 1, E: 1, P: 0.1 });

    expect(GPTEventHub.emit).toHaveBeenCalledWith('emergence:detected', {
      C: 1,
      R: 1,
      E: 1,
      P: 0.1,
    });
    expect(manager.addCREPEntry).toHaveBeenCalledWith(1, 1, 1, 0.1);
  });

  it('does not emit emergence when below threshold', () => {
    const manager = new CREPManager();
    const evaluator = new CREPEvaluator(manager);
    jest.spyOn(manager, 'addCREPEntry');
    jest.spyOn(GPTEventHub, 'emit');

    evaluator.evaluateNewDataPoint({ C: 1, R: 1, E: 0.1, P: 0.5 });

    expect(GPTEventHub.emit).not.toHaveBeenCalledWith('emergence:detected', expect.anything());
    expect(manager.addCREPEntry).toHaveBeenCalled();
  });
});
