import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from './ChatPanel';
import { CREPProvider } from '../contexts/CREPContext';
import * as chat from '../../gpt-bridges/ChatGPTWrapper';

jest.spyOn(chat, 'chatWithContext').mockResolvedValue('ok');

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <CREPProvider>{children}</CREPProvider>
);

test('sends message and shows reply', async () => {
  const { getByLabelText, getByText } = render(<ChatPanel />, { wrapper });
  fireEvent.change(getByLabelText('chat-input'), { target: { value: 'hi' } });
  fireEvent.click(getByText('Send'));
  await waitFor(() => getByText(/AI:/));
  expect(chat.chatWithContext).toHaveBeenCalledWith('hi', undefined);
});
