import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FrequencyMandala from './FrequencyMandala';

test('renders svg element', () => {
  const { container } = render(<FrequencyMandala freqs={[1, 2, 3, 4]} />);
  expect(container.querySelector('svg')).toBeInTheDocument();
});
