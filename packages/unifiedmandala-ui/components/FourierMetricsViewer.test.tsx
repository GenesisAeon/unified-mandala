import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FourierMetricsViewer from './FourierMetricsViewer';
import fourierBridge from '../api/fourierBridge';

global.WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  close() {}
  constructor(public url: string) {}
  send(data: string) {
    this.onmessage?.({ data });
  }
} as any;

import { act } from 'react-dom/test-utils';

test('renders svg when event received', () => {
  render(<FourierMetricsViewer />);
  act(() => {
    fourierBridge.emit('fourier:metrics-svg', { id: 't', svg: '<svg></svg>' });
  });
  expect(screen.getByLabelText('Fourier Metrics SVG')).toBeInTheDocument();
});
