// d3 ist ESM-only, daher hier minimal gemockt
jest.mock('d3', () => ({
  select: () => ({
    selectAll: () => ({ remove: jest.fn() }),
    append: () => ({
      attr: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
      enter: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      call: jest.fn().mockReturnThis(),
    }),
  }),
  forceSimulation: () => ({ force: jest.fn().mockReturnThis(), on: jest.fn() }),
  forceLink: () => ({ id: jest.fn().mockReturnThis(), distance: jest.fn().mockReturnThis() }),
  forceManyBody: () => ({ strength: jest.fn().mockReturnThis() }),
  forceCenter: jest.fn(),
  drag: () => ({ on: jest.fn().mockReturnThis() }),
  interpolateRainbow: jest.fn(() => '#fff'),
}));

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaNetworkView from './MandalaNetworkView';

test('renders svg and filter options', () => {
  render(<MandalaNetworkView />);
  expect(screen.getByLabelText('Mandala Netzwerk')).toBeInTheDocument();
  // one option per type plus "Alle"
  const options = screen.getAllByRole('option');
  expect(options.length).toBeGreaterThan(1);
});
