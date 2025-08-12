import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlackboxMirrorBoard from './BlackboxMirrorBoard';

test('mirrors typed input', () => {
  const { getByLabelText } = render(<BlackboxMirrorBoard />);
  const input = getByLabelText('blackbox-input') as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: 'Hallo' } });
  expect(getByLabelText('blackbox-mirror')).toHaveTextContent('ollaH');
});
