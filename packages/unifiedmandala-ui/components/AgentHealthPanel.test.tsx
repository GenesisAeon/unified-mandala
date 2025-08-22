import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentHealthPanel from './AgentHealthPanel';

test('renders agent heartbeat entries', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ agentId: 'alpha', status: 'ok' }]),
    }) as any
  );

  render(<AgentHealthPanel />);

  await waitFor(() => screen.getByLabelText('agent-alpha'));
  expect(screen.getByLabelText('agent-alpha')).toHaveTextContent('alpha: ok');
});
