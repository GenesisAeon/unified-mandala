import { renderHook } from '@testing-library/react';
import { useABLayout } from './useABLayout';
import * as metrics from '../../../services/crep-metrics';

jest.spyOn(metrics, 'sendABMetric').mockImplementation(() => {});

it('returns A or B and sends metric', () => {
  const { result } = renderHook(() => useABLayout());
  expect(['A', 'B']).toContain(result.current);
  expect(metrics.sendABMetric).toHaveBeenCalled();
});
