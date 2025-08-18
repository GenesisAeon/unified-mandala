import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RAGSearchPanel from './RAGSearchPanel';

describe('RAGSearchPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({ json: async () => ({ hits: [] }) });
  });

  test('executes search request', () => {
    render(<RAGSearchPanel />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });
    fireEvent.click(screen.getByText('Search'));
    expect(fetch).toHaveBeenCalledWith('/rag/search?q=test');
  });
});
