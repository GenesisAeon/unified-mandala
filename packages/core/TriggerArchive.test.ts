import { TriggerArchive, useTriggerArchive } from './TriggerArchive';
import { renderHook, act } from '@testing-library/react';

describe('TriggerArchive', () => {
  it('records triggers and exposes latest entries', () => {
    TriggerArchive.record('alpha');
    TriggerArchive.record('beta');
    expect(TriggerArchive.latest(2).map(t => t.label)).toEqual(['alpha', 'beta']);
  });

  it('useTriggerArchive hook updates when adding trigger', () => {
    const { result } = renderHook(() => useTriggerArchive());
    act(() => {
      result.current.addTrigger('gamma');
    });
    expect(result.current.triggers.some((t: { label: string }) => t.label === 'gamma')).toBe(true);
  });
});
