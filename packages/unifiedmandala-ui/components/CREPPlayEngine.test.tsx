import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPPlayEngine from './CREPPlayEngine';

jest.mock('../hooks/useCREP', () => ({
  useCREP: () => ({ triggerCREP: jest.fn() }),
}));

describe('CREPPlayEngine', () => {
  it('triggers CREP with selected values', () => {
    const trigger = jest.fn();
    (require('../hooks/useCREP') as any).useCREP = () => ({ triggerCREP: trigger });
    render(<CREPPlayEngine />);
    fireEvent.change(screen.getAllByRole('slider')[0], { target: { value: '7' } });
    fireEvent.click(screen.getByText('Trigger'));
    expect(trigger).toHaveBeenCalledWith(expect.objectContaining({ C: 7 }));
  });
});
