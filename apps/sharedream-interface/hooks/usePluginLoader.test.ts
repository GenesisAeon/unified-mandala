import { renderHook, act } from '@testing-library/react';
import { usePluginLoader } from './usePluginLoader';

const manifestYAML = `plugins:\n  - name: MetaScoreChart\n    version: '1.0.0'\n    component: '../components/MetaScoreChart'\n    dataHook: '../hooks/useMetaScores'`;
const invalidManifest = `plugins:\n  - name: BrokenPlugin\n    component: '../components/MetaScoreChart'`;

describe('usePluginLoader', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({ text: () => Promise.resolve(manifestYAML) }),
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

  test('handles invalid manifest', async () => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({ text: () => Promise.resolve(invalidManifest) }),
    );
    const { result } = renderHook(() => usePluginLoader());
    await act(async () => {});
    expect(result.current.error).toBe('Ungültiges Plugin-Manifest');
  });
});
