import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeatmapWidget from './HeatmapWidget';
import { CREPManager } from '../../crep-engine/CREPManager';

jest.useFakeTimers();

test('renders heatmap cells for crep history', () => {
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(k: string) {
      return this.store[k] || null;
    },
    setItem(k: string, v: string) {
      this.store[k] = v;
    },
    clear() {
      this.store = {};
    }
  };
  const manager = new CREPManager();
  manager.addCREPEntry(1,1,1,1);
  const { container } = render(<HeatmapWidget manager={manager} size={1} />);
  jest.runOnlyPendingTimers();
  expect(container.querySelectorAll('.nullmembran-si-heatmap div').length).toBe(1);
});

jest.useRealTimers();
