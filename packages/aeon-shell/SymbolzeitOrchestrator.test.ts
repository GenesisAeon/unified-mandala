import { SymbolzeitOrchestrator } from './SymbolzeitOrchestrator';
import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';

jest.mock('../shared-utils/symbolzeitModulator');

const mockedGetPhase = getSymbolzeitPhase as jest.MockedFunction<typeof getSymbolzeitPhase>;

describe('SymbolzeitOrchestrator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedGetPhase.mockReturnValue('morgen');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('emits phaseChange when phase updates', () => {
    const orchestrator = new SymbolzeitOrchestrator(1000);
    const handler = jest.fn();
    orchestrator.on('phaseChange', handler);
    orchestrator.start();

    mockedGetPhase.mockReturnValue('tag');
    jest.advanceTimersByTime(1000);

    expect(handler).toHaveBeenCalledWith({ phase: 'tag' });

    orchestrator.stop();
  });
});
