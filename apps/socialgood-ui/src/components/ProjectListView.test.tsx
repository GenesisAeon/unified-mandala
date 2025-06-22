import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectListView from './ProjectListView';

test('renders provided projects', () => {
  render(<ProjectListView projects={['A', 'B']} />);
  expect(screen.getByLabelText('Project List')).toHaveTextContent('A');
  expect(screen.getByLabelText('Project List')).toHaveTextContent('B');
});
