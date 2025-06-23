import { renderHook, act } from '@testing-library/react';
import { useAdminMetrics } from './useAdminMetrics';

const apiResponse = { avgCREP: 0.8, sigillinAdoption: 3, openTodos: 2 };

describe('useAdminMetrics', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(apiResponse) })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('loads admin metrics', async () => {
    const { result } = renderHook(() => useAdminMetrics());
    await act(async () => {});
    expect(result.current.metrics?.avgCREP).toBe(0.8);
  });
});
