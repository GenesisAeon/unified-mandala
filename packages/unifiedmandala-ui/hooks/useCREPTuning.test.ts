import { renderHook } from '@testing-library/react';
import { useCREPTuning } from './useCREPTuning';
import * as crepHook from './useCREP';
import { getCREPTuning } from '../../shared-utils/crepHelpers';

jest.mock('./useCREP');
jest.mock('../../shared-utils/crepHelpers', () => ({
  getCREPTuning: jest.fn(),
}));

test('returns tuning based on latest CREP history', () => {
  (crepHook.useCREP as jest.Mock).mockReturnValue({ history: [{ C: 8, R: 8, E: 8, P: 5 }] });
  (getCREPTuning as jest.Mock).mockReturnValue({ color: 'green', frequency: 270 });
  const { result } = renderHook(() => useCREPTuning());
  expect(result.current).toEqual({ color: 'green', frequency: 270 });
});
