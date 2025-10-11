import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CREPProvider, useCREPContext } from '../contexts/CREPContext';
import { useAdaptiveLayout } from './useAdaptiveLayout';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CREPProvider>{children}</CREPProvider>
);

test('returns critical layout when CREP state is critical', () => {
  const { result } = renderHook(
    () => {
      const ctx = useCREPContext();
      const layout = useAdaptiveLayout();
      return { ctx, layout };
    },
    { wrapper },
  );

  act(() => {
    result.current.ctx.triggerCREP({ C: 1, R: 1, E: 1, P: 1 });
  });

  expect(result.current.layout.gridTemplateAreas).toContain('alert');
});

test('returns safe layout when CREP state is safe', () => {
  const { result } = renderHook(
    () => {
      const ctx = useCREPContext();
      const layout = useAdaptiveLayout();
      return { ctx, layout };
    },
    { wrapper },
  );

  act(() => {
    result.current.ctx.triggerCREP({ C: 8, R: 8, E: 8, P: 1 });
  });

  expect(result.current.layout.gridTemplateAreas).toContain('sidebar');
});
