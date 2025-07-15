import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NullmembranSIHeatmap from './NullmembranSIHeatmap';

test('renders heatmap cells for values', () => {
  const values = [0, 1, 2];
  const { container } = render(<NullmembranSIHeatmap values={values} />);
  expect(container.querySelectorAll('.nullmembran-si-heatmap div').length).toBe(values.length);
});
