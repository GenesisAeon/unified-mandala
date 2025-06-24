import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetaScoreChart from './MetaScoreChart';

jest.mock('../hooks/useMetaScores', () => ({
  useMetaScores: () => ({
    scores: [
      { id: 'a', value: 0.4 },
      { id: 'b', value: 0.7 },
    ],
    error: null,
    loading: false,
    retry: jest.fn(),
  }),
}));

it('renders chart with meta score data', () => {
  render(<MetaScoreChart />);
  // expect svg to be in the document
  expect(screen.getByLabelText('MetaScore Chart')).toBeInTheDocument();
});
