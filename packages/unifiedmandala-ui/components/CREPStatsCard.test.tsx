import { render, screen } from '@testing-library/react';
import CREPStatsCard from './CREPStatsCard';

test('renders average resonance', () => {
  render(<CREPStatsCard avgResonance={5} />);
  expect(screen.getByText(/Avg Resonance/)).toBeInTheDocument();
});
