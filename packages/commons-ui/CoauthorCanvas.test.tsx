import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoauthorCanvas from './CoauthorCanvas';

class MockWebSocket {
  onmessage: ((ev: MessageEvent) => void) | null = null;
  readyState = 1;
  constructor(url: string) {
    this.url = url;
  }
  url: string;
  send() {
    /* noop */
  }
  close() {
    /* noop */
  }
  addEventListener() {
    /* noop */
  }
  removeEventListener() {
    /* noop */
  }
}

(global as any).WebSocket = MockWebSocket as any;

test('renders coauthor canvas', () => {
  render(<CoauthorCanvas />);
  expect(screen.getByLabelText('CoauthorCanvas')).toBeInTheDocument();
  expect(screen.getByLabelText('coauthor-editor')).toBeInTheDocument();
});
