import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import FourierVisual from './FourierVisual';
import fourierBridge from '../api/fourierBridge';

(global as any).WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  close() {}
  constructor(public url: string) {}
};

test('renders chart when metrics received', () => {
  render(<FourierVisual />);
  act(() => {
    fourierBridge.emit('fourier:metrics', {
      id: 't',
      metrics: { maxAmplitude: 1, avgAmplitude: 0.5 },
    });
  });
  expect(screen.getByLabelText('Fourier Visual')).toBeInTheDocument();
});
