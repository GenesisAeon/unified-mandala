import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentBadge from './SentimentBadge';

test('renders positive sentiment', () => {
  render(<SentimentBadge score={0.5} />);
  const badge = screen.getByTestId('sentiment-badge');
  expect(badge).toHaveTextContent('positive');
});

test('renders negative sentiment', () => {
  render(<SentimentBadge score={-0.7} />);
  const badge = screen.getByTestId('sentiment-badge');
  expect(badge).toHaveTextContent('negative');
});

test('renders neutral sentiment for zero score', () => {
  render(<SentimentBadge score={0} />);
  const badge = screen.getByTestId('sentiment-badge');
  expect(badge).toHaveTextContent('neutral');
});

test('renders neutral sentiment for slight positive score', () => {
  render(<SentimentBadge score={0.19} />);
  const badge = screen.getByTestId('sentiment-badge');
  expect(badge).toHaveTextContent('neutral');
});
