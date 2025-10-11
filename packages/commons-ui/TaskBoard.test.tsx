import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskBoard from './TaskBoard';

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([]) }),
) as unknown as typeof fetch;

test('renders task board heading', () => {
  render(<TaskBoard />);
  expect(screen.getByLabelText('TaskBoard')).toBeInTheDocument();
  expect(screen.getByText('Task Board')).toBeInTheDocument();
});
