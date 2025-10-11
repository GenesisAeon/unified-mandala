import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TaskDNA from './TaskDNA';

test('renders tasks', () => {
  const { getByText } = render(<TaskDNA tasks={['A', 'B']} />);
  expect(getByText('A')).toBeInTheDocument();
  expect(getByText('B')).toBeInTheDocument();
});
