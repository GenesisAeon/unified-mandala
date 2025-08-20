// d3 ist ESM-only, daher hier minimal gemockt
const mockData = jest.fn().mockReturnThis();
jest.mock('d3', () => ({
  select: () => ({
    selectAll: () => ({ remove: jest.fn() }),
    call: jest.fn().mockReturnThis(),
    append: () => ({
      attr: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: mockData,
      enter: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      call: jest.fn().mockReturnThis(),
      on: jest.fn(),
    }),
  }),
  forceSimulation: () => ({ force: jest.fn().mockReturnThis(), on: jest.fn() }),
  forceLink: () => ({ id: jest.fn().mockReturnThis(), distance: jest.fn().mockReturnThis() }),
  forceManyBody: () => ({ strength: jest.fn().mockReturnThis() }),
  forceCenter: jest.fn(),
  drag: () => ({ on: jest.fn().mockReturnThis() }),
  zoom: () => ({ on: jest.fn().mockReturnThis() }),
}));

jest.mock('../data/sigillin_nodes.json', () => [
  {
    id: 'run1',
    label: 'Run1',
    crep: { C: 1, R: 1, E: 1, P: 1 },
    related: [],
    type: 'run',
    status: 'active',
    model: 'gpt-5',
  },
  {
    id: 'run2',
    label: 'Run2',
    crep: { C: 1, R: 1, E: 1, P: 1 },
    related: [],
    type: 'run',
    status: 'active',
    model: 'gpt-4',
  },
]);

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaNetworkView from './MandalaNetworkView';

test('renders svg and filter options', () => {
  render(<MandalaNetworkView />);
  expect(screen.getByLabelText('Mandala Netzwerk')).toBeInTheDocument();
  const selects = screen.getAllByRole('combobox');
  expect(selects.length).toBe(3);
});

test('shows placeholder when no node is selected', () => {
  render(<MandalaNetworkView />);
  expect(screen.getByTestId('node-details')).toHaveTextContent('No node selected');
});

test('filters nodes by gpt-5 model', () => {
  render(<MandalaNetworkView />);
  const modelSelect = screen.getByLabelText('Model:');
  fireEvent.change(modelSelect, { target: { value: 'gpt-5' } });
  const lastCallArg = mockData.mock.calls[mockData.mock.calls.length - 1][0];
  expect(lastCallArg).toHaveLength(1);
  expect(lastCallArg[0].model).toBe('gpt-5');
});
