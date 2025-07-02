import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectList, ProjectDetail } from './index';

test('renders project list', () => {
  render(<ProjectList projects={[{ id: 1, name: 'A' }]} />);
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('renders project detail', () => {
  render(<ProjectDetail project={{ id: 1, name: 'A', notes: 'note' }} />);
  expect(screen.getByText('note')).toBeInTheDocument();
});
