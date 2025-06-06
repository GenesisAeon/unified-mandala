import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LiveCREPPanel from './LiveCREPPanel';

jest.mock('./CREPTriggerPanel', () => ({ __esModule: true, default: () => <div>trigger</div> }));
jest.mock('./CREPChart', () => ({ __esModule: true, default: () => <div>chart</div> }));

it('shows trigger panel and chart', () => {
  render(<LiveCREPPanel />);
  expect(screen.getByText('trigger')).toBeInTheDocument();
  expect(screen.getByText('chart')).toBeInTheDocument();
});
