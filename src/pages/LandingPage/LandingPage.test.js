import React from 'react';
import { render, screen } from '../../testUtils';
import LandingPage from './LandingPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    lang: 'en',
  }),
}));

test('renders landing page with logo and mode buttons', () => {
  render(<LandingPage />);

  expect(screen.getByAltText(/Cosy Languages Logo/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Freestyle/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Study Mode/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Community/i })).toBeInTheDocument();
});
