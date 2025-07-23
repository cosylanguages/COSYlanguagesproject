import React from 'react';
import { render, screen } from '@testing-library/react';
import DictionaryPage from './DictionaryPage';

test('renders dictionary page', () => {
  render(<DictionaryPage />);
  const linkElement = screen.getByText(/Dictionary/i);
  expect(linkElement).toBeInTheDocument();
});
