import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPTestHarness from './CREPTestHarness';

jest.mock('./CREPTriggerPanel', () => ({ __esModule: true, default: () => <div>trigger</div> }));
jest.mock('./CREPChart', () => ({ __esModule: true, default: () => <div>chart</div> }));

it('renders trigger panel and chart', () => {
  render(<CREPTestHarness />);
  expect(screen.getByText('trigger')).toBeInTheDocument();
  expect(screen.getByText('chart')).toBeInTheDocument();
});
