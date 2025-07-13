import { renderHook } from '@testing-library/react';
import { useCREPTuning } from '../hooks/useCREPTuning';
import * as crepHook from '../hooks/useCREP';
import { getCREPTuning } from '../../shared-utils/crepHelpers';

jest.mock('../hooks/useCREP');
jest.mock('../../shared-utils/crepHelpers', () => ({
  getCREPTuning: jest.fn(),
}));

test('maps latest CREP values to tuning info', () => {
  (crepHook.useCREP as jest.Mock).mockReturnValue({ history: [{ C: 8, R: 8, E: 8, P: 5 }] });
  (getCREPTuning as jest.Mock).mockReturnValue({ color: 'green', frequency: 270 });
  const { result } = renderHook(() => useCREPTuning());
  expect(result.current).toEqual({ color: 'green', frequency: 270 });
});
