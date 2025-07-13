import { renderHook } from '@testing-library/react';
import { SigilProvider, useSigilManager } from '../contexts/SigilContext';

test('initializes SigilManager with default sigils', () => {
  const wrapper = ({ children }: any) => <SigilProvider>{children}</SigilProvider>;
  const { result } = renderHook(() => useSigilManager(), { wrapper });
  expect(result.current.list().length).toBeGreaterThan(0);
});
