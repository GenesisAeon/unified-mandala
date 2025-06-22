import { renderHook, act } from '@testing-library/react';
import { usePluginLoader } from './usePluginLoader';

const manifestYAML = `plugins:\n  - name: MetaScoreChart\n    version: '1.0.0'\n    component: '../components/MetaScoreChart'\n    dataHook: '../hooks/useMetaScores'`;

describe('usePluginLoader', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({ text: () => Promise.resolve(manifestYAML) })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('loads plugins from manifest', async () => {
    const { result } = renderHook(() => usePluginLoader());
    await act(async () => {});
    expect(result.current.plugins[0].name).toBe('MetaScoreChart');
    expect(result.current.plugins[0].Component).toBeDefined();
  });
});
