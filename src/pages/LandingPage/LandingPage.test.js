import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';
import { I18nProvider } from '../../i18n/I18nContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    lang: 'en',
  }),
}));

test('renders landing page with logo and mode buttons', () => {
  render(
    <I18nProvider>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </I18nProvider>
  );

  expect(screen.getByAltText(/Cosy Languages Logo/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Freestyle/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Study Mode/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Community/i })).toBeInTheDocument();
});
