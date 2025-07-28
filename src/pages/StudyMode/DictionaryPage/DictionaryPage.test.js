import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DictionaryPage from './DictionaryPage';
import { I18nProvider } from '../../../i18n/I18nContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    lang: 'en',
  }),
}));

test('renders dictionary page', () => {
  render(
    <I18nProvider>
      <MemoryRouter>
        <DictionaryPage />
      </MemoryRouter>
    </I18nProvider>
  );
  const linkElement = screen.getByText(/Dictionary/i);
  expect(linkElement).toBeInTheDocument();
});
