import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetaScoreChart from './MetaScoreChart';

it('renders bars for data', () => {
  const data = [ { layer: 'x', score: 0.5 } ];
  render(<MetaScoreChart data={data} />);
  expect(screen.getByText('x')).toBeInTheDocument();
});
