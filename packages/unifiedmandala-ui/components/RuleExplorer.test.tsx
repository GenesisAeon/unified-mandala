import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RuleExplorer from './RuleExplorer';

test('renders Rule Explorer', () => {
  render(<RuleExplorer />);
  expect(screen.getByText('Rule Explorer')).toBeInTheDocument();
});
