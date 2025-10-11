import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPStatsCard from './CREPStatsCard';

test('renders average resonance', () => {
  render(<CREPStatsCard avgResonance={5} />);
  expect(screen.getByText(/Avg Resonance/)).toBeInTheDocument();
});

test('renders chart when history provided', () => {
  const history = [1, 2, 3];
  render(<CREPStatsCard avgResonance={2} history={history} />);
  // chart uses SVG path element for line
  const paths = document.querySelectorAll('path');
  expect(paths.length).toBeGreaterThan(0);
});

test('fetches resonance when no value provided', async () => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ scores: [{ idx: '1', avgResonance: 0.4 }] }) }),
  );
  render(<CREPStatsCard />);
  await screen.findByText(/0\.40/);
});
