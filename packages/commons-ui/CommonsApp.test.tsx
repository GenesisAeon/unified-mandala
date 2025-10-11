import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommonsApp from './CommonsApp';

jest.mock('../unifiedmandala-ui/components/ResearchHub', () => () => (
  <div aria-label="ResearchHub" />
));
jest.mock('../unifiedmandala-ui/components/VoicePanel', () => () => (
  <div aria-label="VoicePanel" />
));

test('renders research and voice panels', () => {
  render(<CommonsApp />);
  expect(screen.getByLabelText('CommonsApp')).toBeInTheDocument();
  expect(screen.getByLabelText('ResearchHub')).toBeInTheDocument();
  expect(screen.getByLabelText('VoicePanel')).toBeInTheDocument();
});
