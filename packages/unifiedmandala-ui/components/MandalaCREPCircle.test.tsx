import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaCREPCircle from './MandalaCREPCircle';

test('renders svg element', () => {
  const { container } = render(<MandalaCREPCircle value={5} />);
  expect(container.querySelector('svg')).toBeInTheDocument();
});
