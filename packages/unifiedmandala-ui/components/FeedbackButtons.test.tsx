import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackButtons from './FeedbackButtons';
import { AeonSigillinVault } from '../../core/AeonSigillinVault';

describe('FeedbackButtons', () => {
  test('records like and dislike events', () => {
    const spy = jest.spyOn(AeonSigillinVault, 'record');
    render(<FeedbackButtons sigilId="x" />);
    fireEvent.click(screen.getByLabelText('like'));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ content: 'like' }));
    fireEvent.click(screen.getByLabelText('dislike'));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ content: 'dislike' }));
  });
});
