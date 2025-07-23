import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlackboxMandala from './BlackboxMandala';
import MandalaEventBridge from '../events/MandalaEventBridge';

beforeAll(() => {
  // jsdom doesn't implement createObjectURL
  (global as any).URL.createObjectURL = jest.fn();
  (global as any).URL.revokeObjectURL = jest.fn();
});

test('emits svg export event', () => {
  const handler = jest.fn();
  MandalaEventBridge.on('mandala:export-svg', handler);
  const { getByText } = render(<BlackboxMandala />);
  fireEvent.click(getByText('Export SVG'));
  expect(handler).toHaveBeenCalled();
  MandalaEventBridge.off('mandala:export-svg', handler);
});
