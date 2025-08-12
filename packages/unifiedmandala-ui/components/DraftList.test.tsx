import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DraftList from './DraftList';

describe('DraftList', () => {
  test('renders drafts and triggers actions', () => {
    const drafts = [
      { id: '1', title: 'First draft' },
      { id: '2', title: 'Second draft' }
    ];
    const onApprove = jest.fn();
    const onReject = jest.fn();

    render(
      <DraftList drafts={drafts} onApprove={onApprove} onReject={onReject} />
    );

    expect(screen.getByText('First draft')).toBeInTheDocument();
    expect(screen.getByText('Second draft')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Approve')[0]);
    expect(onApprove).toHaveBeenCalledWith('1');

    fireEvent.click(screen.getAllByText('Reject')[1]);
    expect(onReject).toHaveBeenCalledWith('2');
  });
});
