import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactStarter from '../ReactStarter';

test('renders skeleton div', () => {
  const { getByTestId } = render(<ReactStarter />);
  expect(getByTestId('skeleton')).toBeInTheDocument();
});
