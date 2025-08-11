import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from './ChatPanel';
import { CREPProvider } from '../contexts/CREPContext';
import * as chat from '../../gpt-bridges/ChatGPTWrapper';

jest.spyOn(chat, 'chatWithContext').mockResolvedValue('ok');

const fetchMock = jest.fn().mockResolvedValue({ text: () => Promise.resolve('ok') });
beforeEach(() => {
  (global as any).fetch = fetchMock;
  fetchMock.mockClear();
});

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <CREPProvider>{children}</CREPProvider>
);

test('switches between local and external backends', async () => {
  const { getByLabelText, getByText } = render(<ChatPanel />, { wrapper });
  expect(getByLabelText('service-toolbar')).toBeTruthy();

  fireEvent.change(getByLabelText('chat-input'), { target: { value: 'hi' } });
  fireEvent.click(getByText('Send'));
  await waitFor(() => getByText(/AI:/));
  expect(chat.chatWithContext).toHaveBeenCalledWith('hi', undefined);

  fireEvent.click(getByLabelText('external-service'));
  fireEvent.change(getByLabelText('chat-input'), { target: { value: 'yo' } });
  fireEvent.click(getByText('Send'));
  await waitFor(() => getByText(/AI: ok/));
  expect(fetchMock).toHaveBeenCalled();
  expect(chat.chatWithContext).toHaveBeenCalledTimes(1);
});
