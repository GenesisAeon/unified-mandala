import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationStats from './ConversationStats';

test('displays conversation and message counts', () => {
  render(<ConversationStats conversationCount={3} messageCount={10} />);
  expect(screen.getByText('Total Conversations:')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('Total Messages:')).toBeInTheDocument();
  expect(screen.getByText('10')).toBeInTheDocument();
});
