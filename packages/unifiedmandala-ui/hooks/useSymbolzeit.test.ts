import { renderHook, act } from '@testing-library/react';
import { useSymbolzeit } from './useSymbolzeit';

describe('useSymbolzeit', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates phase based on current time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T06:00:00Z'));
    const { result } = renderHook(() => useSymbolzeit());
    expect(result.current.phase).toBe('Initiation');

    jest.setSystemTime(new Date('2023-01-01T13:00:00Z'));
    act(() => {
      jest.advanceTimersByTime(61000);
    });
    expect(result.current.phase).toBe('Aktivierung');
  });
});
