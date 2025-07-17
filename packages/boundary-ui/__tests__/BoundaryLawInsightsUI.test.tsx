import { render, screen } from '@testing-library/react';
import { BoundaryLawInsightsUI } from '../BoundaryLawInsightsUI';

test('renders placeholder', () => {
  render(<BoundaryLawInsightsUI />);
  expect(screen.getByLabelText('boundary-insights')).toBeInTheDocument();
});
