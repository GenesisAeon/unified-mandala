import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaCanvas from './MandalaCanvas';

test('renders canvas with counts', () => {
  const { container, getByTestId } = render(
    <MandalaCanvas boundaryRules={['r1', 'r2']} pantheonEvents={['e1']} />,
  );
  expect(container.querySelector('canvas')).toBeInTheDocument();
  expect(getByTestId('rule-count')).toHaveTextContent('2');
  expect(getByTestId('event-count')).toHaveTextContent('1');
});
