import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CREPProvider, useCREPContext } from '../../unifiedmandala-ui/contexts/CREPContext';
import { ThemeProvider, useResponsiveTheme } from './index';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CREPProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </CREPProvider>
);

test('updates mood based on CREP state', () => {
  const { result } = renderHook(
    () => {
      const ctx = useCREPContext();
      const theme = useResponsiveTheme();
      return { ctx, theme };
    },
    { wrapper },
  );

  act(() => {
    result.current.ctx.triggerCREP({ C: 0, R: 1, E: 5, P: 2 });
  });

  expect(result.current.theme.theme.mood).toBe('critical');
});
